import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import kyClient from "../../shared/services/ky";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";

interface signUpData {
  username: string;
  email: string;
  password: string;
}
async function requestSignUp(data: signUpData) {
  try {
    const response: any = await kyClient.backendApi.post("users/", {
      json: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    });
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  } catch (error: any) {
    const response = await error.response;
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  }
}

interface props {
  isAuthenticated: boolean;
}
function SignUp({ isAuthenticated }: props) {
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

  const [usernameError, setUsernameError] = useState({
    error: false,
    errorMessage: "",
  });
  const [emailError, setEmailError] = useState({
    error: false,
    errorMessage: "",
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
    errorMessage: "",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let username = data.get("username");
    let email = data.get("email");
    let password = data.get("password");
    let confirmPassword = data.get("confirm-password");

    if (!email && !password && !username && !confirmPassword) {
      setUsernameError({
        error: true,
        errorMessage: "This field is required.",
      });
      setEmailError({
        error: true,
        errorMessage: "This field is required.",
      });
      setPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      return;
    }

    let errorFlag = true;
    if (!username) {
      setUsernameError({
        error: true,
        errorMessage: "This field is required.",
      });
    } else {
      username = username.toString().trim();
      if (username.length < 3 || username.length > 24) {
        setUsernameError({
          error: true,
          errorMessage:
            "Ensure this field has no more than 24 and no less than 3 characters",
        });
      } else {
        setUsernameError({ error: false, errorMessage: "" });
        errorFlag = false;
      }
    }

    if (!email) {
      setEmailError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      email = email.toString().trim();
      if (email.length < 5 || email.indexOf("@") == -1) {
        setEmailError({
          error: true,
          errorMessage: "Incorrect email address.",
        });
        errorFlag = true;
      } else {
        setEmailError({ error: false, errorMessage: "" });
        errorFlag = false;
      }
    }

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
      } else {
        setPasswordError({ error: false, errorMessage: "" });
        errorFlag = false;
      }
    }
    if (!confirmPassword) {
      setPasswordError({
        error: true,
        errorMessage: "This field is required.",
      });
      errorFlag = true;
    } else {
      confirmPassword = confirmPassword.toString();
      if (confirmPassword !== password) {
        setPasswordError({
          error: true,
          errorMessage:
            "Passwords do not match. Please ensure that both passwords entered are identical.",
        });
        errorFlag = true;
      } else if (!passwordError) {
        setPasswordError({ error: false, errorMessage: "" });
        errorFlag = false;
      }
    }

    if (errorFlag) {
      return;
    }

    if (email && password && username) {
      username = username.toString().trim();
      email = email.toString().trim();
      password = password.toString();
    } else {
      return;
    }

    requestSignUp({
      username: username,
      email: email,
      password: password,
    }).then((result) => {
      if (result.status === 201) {
        setSignedUpAlertMessage(
          `A verification email will be promptly sent to this address: ${result.data.email}`
        );
        setSuccessSnackbarOpen(true);
        setApiError({ error: false, errorMessage: "" });
      } else {
        const data = result.data;

        if (result.status == 400) {
          if ("username" in data) {
            setUsernameError({
              error: true,
              errorMessage: data.username,
            });
            errorFlag = true;
          }
          if ("email" in data) {
            setEmailError({
              error: true,
              errorMessage: data.email,
            });
            errorFlag = true;
          }
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
    });
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  });
  // Sign In
  const handleSignInClick = () => {
    navigate("/signin");
  };

  return (
    <Container component="main" maxWidth="xs">
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

      <CssBaseline />

      {!successSnackbarOpen && (
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
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

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              helperText={usernameError.error ? usernameError.errorMessage : ""}
              error={usernameError.error}
            />
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText={passwordError.error ? passwordError.errorMessage : ""}
              error={passwordError.error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="current-password"
              helperText={passwordError.error ? passwordError.errorMessage : ""}
              error={passwordError.error}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 0 }}
            >
              Sign Up
            </Button>
            <Button type="submit" variant="outlined" sx={{ mt: 1, mb: 3 }}>
              <GoogleIcon></GoogleIcon>&nbsp;&nbsp;Sign Up with Google
            </Button>

            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link onClick={handleSignInClick} href="#" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default SignUp;
