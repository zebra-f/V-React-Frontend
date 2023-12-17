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
import PasswordIcon from "@mui/icons-material/Password";
import Snackbar from "@mui/material/Snackbar";

interface passwordResetData {
  newPassword: string;
  id: string;
  token: string;
}
async function requestPasswordResetPassword(data: passwordResetData) {
  try {
    const response: any = await kyClient.backendApi.patch(
      `users/token-password-reset/?id=${data.id}&token=${data.token}`,
      {
        json: {
          new_password: data.newPassword,
        },
      }
    );
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  } catch (error: any) {
    try {
      const response = await error.response;
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } catch (error: any) {
      return { status: 500, data: {} };
    }
  }
}

function passwordResetPassword(id: string, token: string) {
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState("");
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

  const [passwordError, setPasswordError] = useState({
    error: false,
    errorMessage: "",
  });

  const handlePasswordResetEmailSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let newPassword = data.get("new-password");
    let confirmNewPassword = data.get("confirm-new-password");

    let errorFlag = false;
    if (!newPassword) {
      setPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      newPassword = newPassword.toString();
      if (newPassword.length < 8) {
        setPasswordError({
          error: true,
          errorMessage:
            "This password is too short. It must contain at least 8 characters.",
        });
        errorFlag = true;
        return;
      } else {
        setPasswordError({ error: false, errorMessage: "" });
      }
    }
    if (!confirmNewPassword) {
      setPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      confirmNewPassword = confirmNewPassword.toString();
      if (confirmNewPassword !== newPassword) {
        setPasswordError({
          error: true,
          errorMessage:
            "Passwords do not match. Please ensure that both passwords entered are identical.",
        });
        errorFlag = true;
      } else if (!passwordError) {
        setPasswordError({ error: false, errorMessage: "" });
      }
    }

    if (errorFlag) {
      return;
    }

    if (newPassword && confirmNewPassword) {
      newPassword = newPassword.toString();
      confirmNewPassword = confirmNewPassword.toString();
    } else {
      return;
    }

    requestPasswordResetPassword({
      newPassword: newPassword,
      id: id,
      token: token,
    }).then((result) => {
      if (result.status === 200) {
        setApiError({ error: false, errorMessage: "" });
        setSuccessAlertMessage(
          "Your new password has been successfully set. You can now sign in."
        );
        setSuccessSnackbarOpen(true);
        const newPasswordInput = document.getElementById(
          "new-password"
        ) as HTMLInputElement;
        const confirmNewPasswordInput = document.getElementById(
          "confirm-new-password"
        ) as HTMLInputElement;
        newPasswordInput.value = "";
        confirmNewPasswordInput.value = "";
      } else {
        if (result.status === 400 && "new_password" in result.data) {
          setPasswordError({
            error: true,
            errorMessage: result.data.new_password,
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
            <PasswordIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Password Reset
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
          {!successSnackbarOpen && (
            <Box
              component="form"
              onSubmit={handlePasswordResetEmailSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="new-password"
                label="New Password"
                type="password"
                id="new-password"
                autoComplete="current-password"
                helperText={
                  passwordError.error ? passwordError.errorMessage : ""
                }
                error={passwordError.error}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm-new-password"
                label="Confirm New Password"
                type="password"
                id="confirm-new-password"
                autoComplete="current-password"
                helperText={
                  passwordError.error ? passwordError.errorMessage : ""
                }
                error={passwordError.error}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 0 }}
              >
                Submit
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}

export default passwordResetPassword;
