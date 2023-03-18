import { useState, createContext, useMemo } from "react";
import { Routes, Route } from "react-router-dom";

import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import {
//   PaletteMode,
// } from "@mui/material/";
import CssBaseline from "@mui/material/CssBaseline";
import {
  amber,
  grey,
  blue,
  pink,
  brown,
  red,
  lightBlue,
  orange,
  deepOrange,
  yellow,
} from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Vees from "./components/Vees";
import About from "./components/About";
import Length from "./components/Length";
import Speed from "./components/Speed";

import useLocalStorageState from "use-local-storage-state";

import "./App.css";

function App(props: any) {
  const [measurementSystem, setMeasurementSystem] = useState<
    "metric" | "imperial"
  >("metric");
  return (
    <div
      className="App"
      style={
        {
          // height: "100vh",
          // background: "theme.palette.background.default",
          //   backgroundImage:
          //     "linear-gradient(to right top, #090a0f, #090a0f, #090a0f, #090a0f, #090a0f, #090a0f, #090a0f, #111319, #141820, #171d27, #19222e, #1b2735)",
        }
      }
    >
      <Navbar
        setSessionThemeMode={props.setSessionThemeMode}
        sessionThemeMode={props.sessionThemeMode}
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
  const getDesignTokens = (mode: any) => ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            // color: "#7371FC"
            primary: {
              main: red[400],
              contrastText: "#edf6f9",
            },
            secondary: {
              main: red[400],
              contrastText: "#edf6f9",
            },
            divider: grey[400],
            text: {
              primary: grey[800],
              secondary: grey[800],
            },
            background: {
              default: "#fbfefb",
              paper: "#fbfefb",
            },
          }
        : {
            // palette values for dark mode
            primary: blue,
            secondary: red,
            divider: "#1B2735",
            background: {
              default: "#090A0F",
              paper: "#000000",
            },
            text: {
              primary: "#243141",
              secondary: blue[200],
            },
            action: {
              selected: "#3c4576",
              active: "#3c4576",
              disabled: "#00868c",
            },
          }),
    },
  });
  const theme = useMemo(
    () =>
      createTheme({
        // palette
        ...getDesignTokens(mode),
        transitions: {
          duration: {
            enteringScreen: 600,
            leavingScreen: 200,
          },
        },
      }),
    [mode]
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App
          setSessionThemeMode={setSessionThemeMode}
          sessionThemeMode={sessionThemeMode}
        />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
