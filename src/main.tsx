import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./providers/ThemeProvider";
import { THEME_STORAGE_KEY } from "./lib/utils";
import "@cubing/icons";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <ThemeProvider defaultTheme="dark" storageKey={THEME_STORAGE_KEY}>
            <App />
            <Toaster />
      </ThemeProvider>
);
