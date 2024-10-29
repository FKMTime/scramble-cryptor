import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider value={defaultSystem}>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </ChakraProvider>
);
