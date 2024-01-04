import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import useTheme from "@mui/material/styles/useTheme";
import { useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import kyClient from "../../../shared/services/ky";

async function requestPasswordChange(
  id: string,
  password: string,
  newPassword: string
) {
  try {
    const jsonResponse = kyClient.backendApi.patch(`users/${id}/`).json();
    return jsonResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default function ChangePassword() {
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [signedUpAlertMessage, setSignedUpAlertMessage] = useState("");
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
      password = password.toString();
      if (password.length < 8) {
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
      if (confirmNewPassword !== password) {
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

    if (password) {
      password = password.toString();
    } else {
      return;
    }

    requestPasswordChange("fkdjkfdjkfdj", password, "fkdjfkdjkfd").then(
      (result: any) => {
        if (result.status === 201) {
          setSignedUpAlertMessage(
            `A verification email will be promptly sent to this address: ${result.data.email}`
          );
          setSuccessSnackbarOpen(true);
          setApiError({ error: false, errorMessage: "" });
        } else {
          const data = result.data;

          if (result.status == 400) {
            if ("password" in data) {
              setPasswordError({
                error: true,
                errorMessage: data.password,
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
      }
    );
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
          {signedUpAlertMessage}
        </Alert>
      </Snackbar>
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
