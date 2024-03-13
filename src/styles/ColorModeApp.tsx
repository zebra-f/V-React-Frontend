import { useState, createContext, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

import "../App.css";
import App from "../App";
import getTheme from "./theme";
import backgroundDivStyle from "./background";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export default function ColorModeApp() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [sessionThemeMode, setSessionThemeMode] = useLocalStorageState(
    "themeMode",
    {
      defaultValue: prefersDarkMode ? "dark" : "light",
    },
  );
  const [mode, setMode] = useState<"light" | "dark">(
    sessionThemeMode === "dark" ? "dark" : "light",
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <div style={backgroundDivStyle(mode)}>
          <App
            setSessionThemeMode={setSessionThemeMode}
            sessionThemeMode={sessionThemeMode}
          />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
