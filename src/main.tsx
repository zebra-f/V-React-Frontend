import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ThemeProvider,
  createTheme,
  PaletteMode,
  CssBaseline,
} from "@mui/material";
import {
  amber,
  grey,
  deepOrange,
  blue,
  pink,
  teal,
} from "@mui/material/colors";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: blue,
          secondary: blue,
          divider: blue[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: grey,
          secondary: grey,
          divider: pink[500],
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

const theme = createTheme({
  // palette
  ...getDesignTokens("dark"),
  transitions: {
    duration: {
      enteringScreen: 2000,
      leavingScreen: 100,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
