import { useState } from "react";
import { useNavigate } from "react-router-dom";

import jwt from "../../../utils/jwt";

import { useIsAuthenticated } from "../../../shared/contexts/IsAuthenticated";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import kyClient from "../../../shared/services/ky";

async function requestDeleteAccount(id: string) {
  try {
    const response = await kyClient.backendApi.delete(`users/${id}/`, {
      retry: { limit: 0 },
    });
    const responseData = {};
    return { status: response.status, data: responseData };
  } catch (error: any) {
    try {
      const response = await error.response;
      const responseData = await response.json();
      return { status: 401, data: responseData };
    } catch (_error: any) {
      return { status: 500, data: {} };
    }
  }
}
export default function DeleteAccount() {
  const navigate = useNavigate();

  const [, setIsAuthenticated] = useIsAuthenticated();

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

  const [apiError, setApiError] = useState({
    error: false,
    errorMessage: "",
  });
  const [deleteError, setDeleteError] = useState({
    error: false,
    errorMessage: "",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let deleteInput = data.get("delete");

    if (!deleteInput) {
      setDeleteError({
        error: true,
        errorMessage: "This field is required.",
      });
    }

    let errorFlag = false;
    if (!deleteInput) {
      setDeleteError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      if (deleteInput !== "DELETE") {
        setDeleteError({
          error: true,
          errorMessage: "Wrong input, type DELETE",
        });
        errorFlag = true;
      } else {
        setDeleteError({
          error: false,
          errorMessage: "",
        });
      }
    }

    if (deleteInput) {
      deleteInput = deleteInput.toString();
    } else {
      return;
    }

    requestDeleteAccount(jwt.getUserId(localStorage.access)).then((result) => {
      if (result.status === 204) {
        setApiError({ error: false, errorMessage: "" });
        setSuccessAlertMessage("Your account has been deleted.");
        setSuccessSnackbarOpen(true);
        localStorage.removeItem("access");
        setIsAuthenticated(false);
        const deleteInput = document.getElementById(
          "deleteInput",
        ) as HTMLInputElement;
        deleteInput.value = "";
        navigate("/");
      } else {
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
              Delete Your Account
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Goodbye and remember that you're always welcome back whenever you
              wish. Thank you for being a part of this community.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Please type 'DELETE' (in uppercase) in the form below to submit a
              request for deleting your account.
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
                name="delete"
                label="DELETE"
                type="text"
                id="deleteInput"
                helperText={deleteError.error ? deleteError.errorMessage : ""}
                error={deleteError.error}
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
            Note: A reminder that non private data asociated with your username
            might be available for some time in the search engine
          </Typography>
        </Container>
      </Paper>
    </>
  );
}
