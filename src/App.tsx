import logo from "@/assets/logo.svg";
import { Competition as WCIF } from "@wca/helpers";
import { useState } from "react";
import { getWCIFFromName } from "./lib/utils";
import { encryptScrambles, generateScramblesForUnofficialEvents } from "./lib/scrambles";
import { invoke } from "@tauri-apps/api/core";
import { useToast } from "./hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import UploadScrambles from "./components/Steps/UploadScrambles/UploadScrambles";
import { Button } from "./components/ui/button";
import GenerateUnofficialEventsScrambles from "./components/Steps/GenerateUnofficialEventsScrambles/GenerateUnofficialEventsScrambles";
import { ScramblePassword, UnofficialEvent } from "./lib/interfaces";
import GenerateAndDownloadScrambles from "./components/Steps/GenerateAndDownloadScrambles/GenerateAndDownloadScrambles";
import { generatePasswordsForUnofficialEvents, getPasswordsTxt } from "./lib/passwords";

const MAX_STEPS = 3;

const App = () => {
  const { toast } = useToast();
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [wcif, setWcif] = useState<WCIF | null>(null);
  const [scramblePasswords, setScramblePasswords] = useState<ScramblePassword[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedEvents, setSelectedEvents] = useState<UnofficialEvent[]>([]);
  const [scramblesGenerated, setScramblesGenerated] = useState<boolean>(false);
  const [step, setStep] = useState(1);

  const handleJSONUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalFileName(file.name);
      const result = reader.result as string;
      const parsedJson = JSON.parse(result);
      console.log(parsedJson);
      setWcif(parsedJson.wcif);
    };
    reader.readAsText(file);
  };

  const handleTXTUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const passwords = [];
      for (const line of result.split(/\r?\n/g)) {
        const [key, value, ..._] = line.split(": ");
        if (!value) {
          continue;
        }
        const data = getWCIFFromName(key);
        passwords.push({
          ...data,
          password: value,
        });
      }
      console.log(passwords);
      setScramblePasswords(passwords);
    };
    reader.readAsText(file);
  };

  const handleGenerateUnofficialEventsScrambles = async () => {
    setIsGenerating(true);
    const newEvents = await generateScramblesForUnofficialEvents(selectedEvents);
    const passwords = generatePasswordsForUnofficialEvents(newEvents);
    setScramblesGenerated(true);
    setIsGenerating(false);
    setWcif((prev) => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        events: [
          ...prev.events,
          //eslint-disable-next-line @typescript-eslint/no-explicit-any 
          //@ts-ignore
          ...newEvents as any,
        ]
      }
    });
    setScramblePasswords((prev) => {
      return [
        ...prev,
        ...passwords,
      ];
    });
  };

  const handleDownload = async () => {
    if (!wcif) return;
    const newWcif = await encryptScrambles(wcif, scramblePasswords);
    const fileContent = JSON.stringify({ wcif: newWcif });
    const fileName = `ENCRYPTED - ${originalFileName}`;
    const passwordsFileName = `${wcif.name} - FKMTime Passcodes - SECRET`;
    const response: string = await invoke("save_encrypted_scrambles", { json: fileContent, fileName });
    const passwordsTxt = getPasswordsTxt(scramblePasswords);
    const txtResponse: string = await invoke("save_passwords_txt", { txt: passwordsTxt, fileName: passwordsFileName });
    if (response.includes("Error") || txtResponse.includes("Error")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to encrypt scrambles",
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: response,
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: txtResponse,
      });
    } else {
      toast({
        variant: "success",
        title: "Success",
        description: "Scrambles encrypted successfully",
      });
      setTimeout(() => {
        setWcif(null);
        setStep(1);
        setScramblesGenerated(false);
        setSelectedEvents([]);
        setScramblePasswords([]);
      }, 1000);
    }
  };

  const handleNextStep = () => {
    if (step < MAX_STEPS) {
      setStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const nextStepAllowed = () => {
    if (step === 1) {
      return wcif !== null && scramblePasswords.length > 0;
    } else if (step < MAX_STEPS) {
      return true;
    }
  };

  const previousStepAllowed = () => {
    return step > 1 && !scramblesGenerated && !isGenerating;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="min-w-1/2">
        <CardHeader className="flex items-center">
          <img src={logo} alt="logo" width="200" height="200" />
          <CardTitle>
            scramble-cryptor
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Progress value={step} />
          {step === 1 && (
            <UploadScrambles
              handleJSONUpload={handleJSONUpload}
              handleTXTUpload={handleTXTUpload}
            />
          )}
          {step === 2 && (
            <GenerateUnofficialEventsScrambles selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} />
          )}
          {step === 3 && (
            <GenerateAndDownloadScrambles
              unofficialEventsCount={selectedEvents.length}
              generateUnofficialEventsScrambles={handleGenerateUnofficialEventsScrambles}
              scramblesGenerated={scramblesGenerated}
              handleDownload={handleDownload}
              isGenerating={isGenerating}
            />
          )}
          <div className="flex gap-3 justify-center">
            <Button variant="destructive" onClick={handlePreviousStep} disabled={!previousStepAllowed()}>
              Previous step
            </Button>
            <Button variant="success" onClick={handleNextStep} disabled={!nextStepAllowed()}>
              Next step
            </Button>
          </div>
        </CardContent>
      </Card>

    </div >
  );
}

export default App;
