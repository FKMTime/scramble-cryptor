import { Box, Fieldset, Heading, List, Stack } from "@chakra-ui/react";
import logo from "@/assets/logo.svg";
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from "@/components/ui/file-button";
import { Button } from "@/components/ui/button";
import { Field } from "./components/ui/field";
import { Competition as WCIF } from "@wca/helpers";
import { useState } from "react";
import { getWCIFFromName } from "./logic/utils";
import { encryptScrambles } from "./logic/scrambles";
import { toaster } from "@/components/ui/toaster"
import { invoke } from "@tauri-apps/api/core";

const App = () => {
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [wcif, setWcif] = useState<WCIF | null>(null);
  const [scramblePasswords, setScramblePasswords] = useState<ScramblePassword[]>([]);
  const [jsonFileKey, setJsonFileKey] = useState(0);
  const [txtFileKey, setTxtFileKey] = useState(0);

  const handleJSONUpload = (details: {
    files: File[];
  }) => {
    const file = details.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalFileName(file.name);
      const result = reader.result as string;
      const parsedJson = JSON.parse(result);
      setWcif(parsedJson.wcif);
    };
    reader.readAsText(file);
  };

  const handleTXTUpload = (details: {
    files: File[];
  }) => {
    const file = details.files[0];
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
      toaster.create({ title: "Error", description: "Failed to encrypt scrambles", type: "error" });
      toaster.create({ title: "Error", description: response, type: "error" });
    } else {
      toaster.create({ title: "Success", description: "Scrambles encrypted successfully", type: "success" });
      setTimeout(() => {
        setWcif(null);
        setScramblePasswords([]);
        setJsonFileKey(prev => prev + 1);
        setTxtFileKey(prev => prev + 1);
      }, 1000);
    }
  };

  return (
    <Box backgroundColor="#2D3748" width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" textAlign="center" pt={5}>
      <Heading color="white" size="3xl">scramble-cryptor</Heading>
      <img src={logo} alt="logo" width="200" height="200" />
      <Box display="flex" backgroundColor="gray.900" width="fit-content" height="fit-content" flexDirection="column" m={10} borderRadius="md" boxShadow="lg" p={5} borderColor="gray.800">
        <Fieldset.Root size="lg" maxW="md">
          <Stack alignItems="flex-start">
            <Fieldset.Legend>Encrypt scrambles</Fieldset.Legend>
            <Fieldset.HelperText>
              Please upload scrambles JSON and TXT file with passwords.
            </Fieldset.HelperText>
            <List.Root textAlign="left" color="gray.300">
              <List.Item>
                JSON file is located in Interchange folder - this is the same you upload to Scrambles Matcher
              </List.Item>
              <List.Item>
                TXT file is located in root folder - this is the same you use to give passwords for scramblers
              </List.Item>
            </List.Root>
          </Stack>
          <Box display="flex" alignItems="center" width="100%" gap={2} pr={3}>
            <Field label="Scrambles JSON">
              <FileUploadRoot maxW="xl" alignItems="stretch" accept=".json" width="100%" onFileAccept={handleJSONUpload} key={jsonFileKey}>
                <FileUploadDropzone
                  label="Drag and drop here to upload"
                  description=".json"
                />
                <FileUploadList />
              </FileUploadRoot>
            </Field>
            <Field label="Passwords TXT">
              <FileUploadRoot maxW="xl" alignItems="stretch" accept=".txt" width="100%" onFileAccept={handleTXTUpload} key={txtFileKey}>
                <FileUploadDropzone
                  label="Drag and drop here to upload"
                  description=".txt"
                />
                <FileUploadList />
              </FileUploadRoot>
            </Field>
          </Box>
        </Fieldset.Root>
        <Box
          display="flex"
          width="100%"
          flexDirection="column"
          alignItems="flex-end"
        >
          <Button
            variant="solid"
            size="lg"
            colorPalette="green"
            width="fit-content"
            mt={5}
            onClick={handleDownload}
          >
            Download encrypted scrambles
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
