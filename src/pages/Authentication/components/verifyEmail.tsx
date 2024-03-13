import { useEffect, useState } from "react";

import kyClient from "../../../shared/services/ky";

import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

function verifyEmail(id: string, token: string) {
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState("");
  const handleCloseAlert = (
    _: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

  useEffect(() => {
    if (id && token) {
      kyClient.backendApi
        .get(
          `users/token-verify-email-activate-user/?id=${id}&token=${token}`,
          { retry: 0 },
        )
        .then((response: any) => {
          if (response.status === 200) {
            setApiError({ error: false, errorMessage: "" });
            setSuccessAlertMessage("You may now proceed to log in.");
            setSuccessSnackbarOpen(true);
          }
        })
        .catch((_error: any) => {
          setApiError({
            error: true,
            errorMessage: "Something went wrong. Try again later.",
          });
        });
    }
  }, []);

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={successSnackbarOpen}
          autoHideDuration={10000}
          onClose={handleCloseAlert}
          sx={{ mt: 6 }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successAlertMessage}
          </Alert>
        </Snackbar>

        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AlternateEmailIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Verify Email
          </Typography>

          {apiError.error && (
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setApiError({ error: false, errorMessage: "" });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ width: "100%", mt: 3 }}
              severity="error"
            >
              {apiError.errorMessage}
            </Alert>
          )}
        </Box>
      </Container>
    </>
  );
}

export default verifyEmail;
