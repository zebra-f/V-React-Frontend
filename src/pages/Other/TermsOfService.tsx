import { useEffect, useState } from "react";

import Markdown from "react-markdown";

import ApiError from "../../shared/components/ApiError";

import useTheme from "@mui/material/styles/useTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function TermsOfService() {
  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(9, 10, 15, 0.9)"
      : "rgba(251, 254, 251, 0.9)";

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

  const [tos, setTos] = useState("");
  useEffect(() => {
    fetch("./termsofservice/tos10.md")
      .then((res) => res.text())
      .then((markdownText) => setTos(markdownText))
      .catch((_: any) => {
        setApiError({
          error: true,
          errorMessage:
            "Oops! Unable to load the Terms of Service at the moment. Please try again later.",
        });
      });
  }, []);

  return (
    <>
      <Box sx={{ backgroundColor: backgroundColor }}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <ApiError apiError={apiError} setApiError={setApiError} />
          <Markdown>{tos}</Markdown>
        </Container>
      </Box>
    </>
  );
}
