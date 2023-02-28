import React from "react";

import { Routes, Route } from "react-router-dom";

import Container from "@mui/material/Container";
import {
  ThemeProvider,
  createTheme,
  PaletteMode,
  CssBaseline,
} from "@mui/material";
import { amber, grey, blue, pink } from "@mui/material/colors";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Vees from "./components/Vees";
import About from "./components/About";
import Length from "./components/Length";
import Speed from "./components/Speed";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Container maxWidth="xl">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="vees" element={<Vees />}>
            <Route path="length" element={<Length />} />
            <Route path="" element={<Speed />} />
          </Route>
          <Route path="about" element={<About />} />
        </Routes>
      </Container>
    </div>
  );
}
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});
export default function AppColorMode() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );
  console.log(colorMode, "\n", typeof colorMode);
  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            primary: amber,
            secondary: blue,
            divider: pink[600],
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
          }
        : {
            // palette values for dark mode
            primary: grey,
            secondary: grey,
            divider: grey[600],
            background: {
              default: "#111111",
              paper: grey[900],
            },
            text: {
              primary: grey[100],
              secondary: grey[100],
            },
          }),
    },
  });
  const theme = React.useMemo(
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
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
