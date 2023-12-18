import { useMemo } from "react";

import { createTheme } from "@mui/material/styles";
import { indigo, grey, red, yellow } from "@mui/material/colors";

export default function getTheme(mode: string) {
  const getDesignTokens = (mode: any) => ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            primary: {
              main: indigo[400],
              contrastText: grey[200],
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
            action: {
              selected: grey[800],
              active: grey[800],
              disabled: grey[800],
            },
          }
        : {
            // palette values for dark mode
            primary: {
              main: indigo[200],
              contrastText: "#000000",
            },
            secondary: {
              main: yellow[200],
              contrastText: "#edf6f9",
            },
            divider: "#1B2735",
            text: {
              primary: indigo[100],
              secondary: "#55B8FF",
            },
            background: {
              default: "#090A0F",
              paper: "#011936",
            },
            action: {
              selected: grey[200],
              active: grey[200],
              disabled: grey[200],
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
  return theme;
}
