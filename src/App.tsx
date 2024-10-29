import { Box, Fieldset, Heading, Stack } from "@chakra-ui/react";
import logo from "@/assets/logo.svg";
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from "@/components/ui/file-button";
import { Button } from "@/components/ui/button";
import { Field } from "./components/ui/field";

const App = () => {
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
          </Stack>
          <Box display="flex" alignItems="center" width="100%" gap={2} pr={3}>
            <Field label="Scrambles JSON">
              <FileUploadRoot maxW="xl" alignItems="stretch" accept=".json" width="100%">
                <FileUploadDropzone
                  label="Drag and drop here to upload"
                  description=".json"
                />
                <FileUploadList />
              </FileUploadRoot>
            </Field>
            <Field label="Passwords TXT">
              <FileUploadRoot maxW="xl" alignItems="stretch" accept=".txt">
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
          >
            Download encrypted scrambles
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
