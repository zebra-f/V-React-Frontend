import { useState, createContext, useMemo } from "react";
import { Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

import Navbar from "./shared/components/Navbar";
import Home from "./pages/Home/Home";
import Vees from "./pages/Vees/Vees";
import About from "./pages/About/About";
import Length from "./pages/Vees/Length";
import Speed from "./pages/Vees/Speed";
import SignIn from "./pages/Authentication/Signin";
import SignUp from "./pages/Authentication/Signup";

import useLocalStorageState from "use-local-storage-state";

import "./App.css";

import backgroundDivStyle from "./styles/background";
import getTheme from "./styles/theme";

import kyClient from "./shared/services/ky";

function App(props: any) {
  const response = kyClient.backendApi.get("speeds/");
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState(
    "isAuthenticated",
    { defaultValue: false }
  );
  setIsAuthenticated(false);

  const [measurementSystem, setMeasurementSystem] = useLocalStorageState<
    "metric" | "imperial"
  >("measurementSystem", {
    defaultValue: "metric",
  });

  return (
    <div className="App" style={backgroundDivStyle(props.mode)}>
      <Navbar
        setSessionThemeMode={props.setSessionThemeMode}
        sessionThemeMode={props.sessionThemeMode}
        isAuthenticated={isAuthenticated}
      />
      <Routes>
        <Route path="" element={<Home />} />
        <Route
          path="vees"
          element={
            <Vees
              setMeasurementSystem={setMeasurementSystem}
              measurementSystem={measurementSystem}
            />
          }
        >
          <Route path="length" element={<Length />} />
          <Route
            path=""
            element={<Speed measurementSystem={measurementSystem} />}
          />
        </Route>
        <Route path="about" element={<About />} />

        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export default function AppColorMode() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [sessionThemeMode, setSessionThemeMode] = useLocalStorageState(
    "themeMode",
    {
      defaultValue: prefersDarkMode ? "dark" : "light",
    }
  );
  const [mode, setMode] = useState<"light" | "dark">(
    sessionThemeMode === "dark" ? "dark" : "light"
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <App
          setSessionThemeMode={setSessionThemeMode}
          sessionThemeMode={sessionThemeMode}
          mode={mode}
        />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
