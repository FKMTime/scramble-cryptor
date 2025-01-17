import logo from "@/assets/logo.svg";
import { Competition as WCIF } from "@wca/helpers";
import { useState } from "react";
import { getWCIFFromName } from "./lib/utils";
import { encryptScrambles } from "./lib/scrambles";
import { invoke } from "@tauri-apps/api/core";
import { useToast } from "./hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import UploadScrambles from "./components/Steps/UploadScrambles/UploadScrambles";
import { Button } from "./components/ui/button";
import GenerateUnofficialEventsScrambles from "./components/Steps/GenerateUnofficialEventsScrambles/GenerateUnofficialEventsScrambles";

const MAX_STEPS = 3;

const App = () => {
  const { toast } = useToast();
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [wcif, setWcif] = useState<WCIF | null>(null);
  const [scramblePasswords, setScramblePasswords] = useState<ScramblePassword[]>([]);
  const [jsonFileKey, setJsonFileKey] = useState(0);
  const [txtFileKey, setTxtFileKey] = useState(0);
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
      setScramblePasswords(passwords);
    };
    reader.readAsText(file);
  };

  const handleDownload = async () => {
    if (!wcif) return;
    const newWcif = await encryptScrambles(wcif, scramblePasswords);
    const fileContent = JSON.stringify({ wcif: newWcif });
    const fileName = `ENCRYPTED - ${originalFileName}`;
    const response: string = await invoke("save_encrypted_scrambles", { json: fileContent, fileName });
    if (response.includes("Error")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to encrypt scrambles",
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: response,
      })
    } else {
      toast({
        variant: "success",
        title: "Success",
        description: "Scrambles encrypted successfully",
      });
      setTimeout(() => {
        setWcif(null);
        setScramblePasswords([]);
        setJsonFileKey(prev => prev + 1);
        setTxtFileKey(prev => prev + 1);
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
    return step > 1;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="w-1/2">
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
            <GenerateUnofficialEventsScrambles />
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

    </div>
  );
}

export default App;
