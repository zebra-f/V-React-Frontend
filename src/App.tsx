import { useState, createContext, useMemo } from "react";
import { Routes, Route } from "react-router-dom";

import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import {
//   PaletteMode,
// } from "@mui/material/";
import CssBaseline from "@mui/material/CssBaseline";
import {
  teal,
  indigo,
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
  deepPurple,
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

import MoonLight from "./assets/svg/moon-main-light.svg";
import UranusDark from "./assets/svg/uranus-main-dark.svg";

function App(props: any) {
  const [measurementSystem, setMeasurementSystem] = useLocalStorageState<
    "metric" | "imperial"
  >("measurementSystem", {
    defaultValue: "metric",
  });

  const backgroundImagePosition =
    window.innerWidth <= 1920
      ? "top right"
      : `${window.innerWidth / 2 + 150}px 0px`;
  const divStyle = (image: string) => {
    return {
      backgroundImage: `url(${image})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: backgroundImagePosition,
      minHeight: "800px",
    };
  };
  return (
    <div
      className="App"
      style={
        props.mode === "light" ? divStyle(MoonLight) : divStyle(UranusDark)
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
              main: indigo[300],
              contrastText: "#028090",
            },
            secondary: {
              main: red[400],
              contrastText: "#edf6f9",
            },
            divider: grey[400],
            text: {
              primary: "#3d5a80",
              secondary: "#028090",
            },
            background: {
              default: "#fbfefb",
              paper: "#fbfefb",
            },
          }
        : {
            // palette values for dark mode
            primary: {
              main: indigo[200],
              contrastText: blue[100],
            },
            secondary: blue,
            divider: "#1B2735",
            background: {
              default: "#090A0F",
              paper: "#1B2735",
            },
            text: {
              primary: indigo[200],
              secondary: "#7fdeff",
            },
            action: {
              selected: "#3c4576",
              active: "#7fdeff",
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
        typography: {
          fontFamily: ["'Montserrat'"].join(","),
          button: {
            textTransform: "none",
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
          mode={mode}
        />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
