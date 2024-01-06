import { useState } from "react";

import jwt from "../../../utils/jwt";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import kyClient from "../../../shared/services/ky";

async function requestPasswordChange(
  id: string,
  password: string,
  newPassword: string
) {
  try {
    const response = await kyClient.backendApi.patch(`users/${id}/`, {
      json: {
        password: password,
        new_password: newPassword,
      },
    });
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

export default function ChangePassword() {
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

  const [apiError, setApiError] = useState({
    error: false,
    errorMessage: "",
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
    errorMessage: "",
  });
  const [newPasswordError, setNewPasswordError] = useState({
    error: false,
    errorMessage: "",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let password = data.get("password");
    let newPassword = data.get("new-password");
    let confirmNewPassword = data.get("confirm-new-password");

    if (!password && !confirmNewPassword && !newPassword) {
      setPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      setNewPasswordError({
        error: true,
        errorMessage: "This field is required",
      });
    }

    let errorFlag = false;
    if (!password) {
      setPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      setPasswordError({
        error: false,
        errorMessage: "",
      });
    }
    if (!newPassword) {
      setNewPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      newPassword = newPassword.toString();
      if (newPassword.length < 8) {
        setNewPasswordError({
          error: true,
          errorMessage:
            "This password is too short. It must contain at least 8 characters.",
        });
        errorFlag = true;
        return;
      } else {
        setNewPasswordError({ error: false, errorMessage: "" });
      }
    }
    if (!confirmNewPassword) {
      setNewPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      confirmNewPassword = confirmNewPassword.toString();
      if (newPassword && confirmNewPassword !== newPassword) {
        setNewPasswordError({
          error: true,
          errorMessage:
            "Passwords do not match. Please ensure that both passwords entered are identical.",
        });
        errorFlag = true;
      } else {
        setNewPasswordError({ error: false, errorMessage: "" });
      }
    }

    if (password && newPassword && confirmNewPassword) {
      password = password.toString();
      newPassword = newPassword.toString();
    } else {
      return;
    }

    requestPasswordChange(
      jwt.getUserId(localStorage.access),
      password,
      newPassword
    ).then((result) => {
      if (result.status === 200) {
        setApiError({ error: false, errorMessage: "" });
        setSuccessAlertMessage("Your new password has been successfully set.");
        setSuccessSnackbarOpen(true);
        const passwordInput = document.getElementById(
          "password"
        ) as HTMLInputElement;
        const newPasswordInput = document.getElementById(
          "new-password"
        ) as HTMLInputElement;
        const confirmNewPasswordInput = document.getElementById(
          "confirm-new-password"
        ) as HTMLInputElement;
        passwordInput.value = "";
        newPasswordInput.value = "";
        confirmNewPasswordInput.value = "";
      } else {
        if (result.status === 400) {
          if ("new_password" in result.data) {
            setNewPasswordError({
              error: true,
              errorMessage: result.data.new_password,
            });
            errorFlag = true;
          }
          if ("password" in result.data) {
            setPasswordError({
              error: true,
              errorMessage: result.data.password,
            });
            errorFlag = true;
          }
        }

        if ("detail" in result.data) {
          setApiError({ error: true, errorMessage: result.data.detail });
          errorFlag = true;
        }

        if (errorFlag) {
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successSnackbarOpen}
        autoHideDuration={12000}
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
      <Paper
        sx={{
          p: 1,
          py: 1,
          display: "flex",
          flexDirection: "column",
          aligntItems: "flex-start",
          overflow: "auto",
        }}
      >
        <Container
          component="main"
          maxWidth="xl"
          sx={{
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ py: 1 }}>
              Change Your Current Password
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              This form allows you to change your account password.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Enter your current password and choose a new password to update
              your account's login credentials.
            </Typography>

            <Typography variant="caption" display="block" gutterBottom>
              <InfoIcon /> If you've signed up with Google and skipped setting
              up a password, please log out and select 'I forgot my password' to
              set up your password, otherwise ignore this form.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                my: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Current Password"
                type="password"
                id="password"
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
                name="new-password"
                label="New Password"
                type="password"
                id="new-password"
                helperText={
                  newPasswordError.error ? newPasswordError.errorMessage : ""
                }
                error={newPasswordError.error}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm-new-password"
                label="Confirm New Password"
                type="password"
                id="confirm-new-password"
                helperText={
                  newPasswordError.error ? newPasswordError.errorMessage : ""
                }
                error={newPasswordError.error}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
          <Typography variant="subtitle2" gutterBottom sx={{ pb: 2 }}>
            Note: Your password protects your account. Keep it confidential and
            don't share it with anyone.
          </Typography>
        </Container>
      </Paper>
    </>
  );
}
