import { useState } from "react";

import kyClient from "../../../shared/services/ky";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

interface passwordResetData {
  email: string;
}
async function requestResendEmail(data: passwordResetData) {
  try {
    const response: any = await kyClient.backendApi.post(
      "users/token-verify-email-activate-user/",
      {
        json: {
          email: data.email,
        },
      },
    );
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  } catch (error: any) {
    try {
      const response = await error.response;
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } catch (_error: any) {
      return { status: 500, data: {} };
    }
  }
}

function verifyEmailResendEmail() {
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

  const [emailError, setEmailError] = useState({
    error: false,
    errorMessage: "",
  });

  const handleResendActivation = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let email = data.get("email");

    if (!email) {
      setEmailError({
        error: true,
        errorMessage: "This field is required.",
      });
      return;
    } else {
      email = email.toString().trim();
      if (email.length < 5 || email.indexOf("@") == -1) {
        setEmailError({
          error: true,
          errorMessage: "Incorrect email address.",
        });
        return;
      } else {
        setEmailError({ error: false, errorMessage: "" });
      }
    }

    if (email) {
      email = email.toString().trim();
    } else {
      return;
    }

    requestResendEmail({ email: email }).then((result) => {
      if (result.status === 200) {
        setApiError({ error: false, errorMessage: "" });
        setSuccessAlertMessage(
          "A verification email will be promptly sent to your address.",
        );
        setSuccessSnackbarOpen(true);
        const emailInput = document.getElementById("email") as HTMLInputElement;
        emailInput.value = "";
      } else {
        const data = result.data;
        if (result.status == 409) {
          setApiError({
            error: true,
            errorMessage: "Your account is already active.",
          });
          return;
        } else if ("email" in data) {
          setEmailError({
            error: true,
            errorMessage: data.email,
          });
          return;
        }
        setApiError({
          error: true,
          errorMessage: "Something went wrong. Try again later.",
        });
      }
    });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={successSnackbarOpen}
          autoHideDuration={6000}
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
          {!successSnackbarOpen && [
            <Typography mb={0} pb={0} variant="subtitle2" gutterBottom>
              Please provide the email you used for sign up,
            </Typography>,
            <Typography mt={0} pt={0} variant="subtitle2" gutterBottom>
              a new email will be sent to you.
            </Typography>,
          ]}
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

          {!successSnackbarOpen && (
            <Box
              component="form"
              onSubmit={handleResendActivation}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                helperText={emailError.error ? emailError.errorMessage : ""}
                error={emailError.error}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 0 }}
              >
                Send
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}

export default verifyEmailResendEmail;
