import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import kyClient from "../../shared/services/ky";

import { openGoogleConsentWindow } from "./services/googleOAuth";

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
import Alert from "@mui/material/Alert";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface signInData {
  email: string;
  password: string;
}
async function requestSignIn(data: signInData) {
  try {
    const response: any = await kyClient.backendApi.post("token/login/", {
      json: {
        email: data.email,
        password: data.password,
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

interface props {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
function SignIn({ isAuthenticated, setIsAuthenticated }: props) {
  const navigate = useNavigate();

  const handleAuthenticatedUser = () => {
    if (isAuthenticated) {
      navigate("/");
    }
  };

  useEffect(() => {
    handleAuthenticatedUser();
  }, []);

  useEffect(() => {
    handleAuthenticatedUser();
  }, [isAuthenticated]);

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

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
    let email = data.get("email");
    let password = data.get("password");

    if (!email && !password) {
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

    let errorFlag = false;
    if (!email) {
      setEmailError({
        error: true,
        errorMessage: "This field is required.",
      });
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
      }
    }
    if (errorFlag) {
      return;
    }

    if (email && password) {
      email = email.toString().trim();
      password = password.toString();
    } else {
      return;
    }

    requestSignIn({ email: email, password: password }).then((result) => {
      if (result.status === 200 && "access" in result.data) {
        localStorage.setItem("access", result.data.access);
        setApiError({ error: false, errorMessage: "" });
        setIsAuthenticated(true);
      } else {
        if ("email" in result.data) {
          setEmailError({
            error: true,
            errorMessage: result.data.email,
          });
          return;
        } else if ("detail" in result.data) {
          setApiError({ error: true, errorMessage: result.data.detail });
          return;
        }
        setApiError({
          error: true,
          errorMessage: "Something went wrong. Try again later.",
        });
      }
    });
  };

  // Sign Up
  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handlePasswordResetClick = () => {
    navigate("/passwordreset");
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 0 }}
            >
              Sign In
            </Button>
            <Button
              onClick={openGoogleConsentWindow}
              variant="outlined"
              sx={{ mt: 1, mb: 3 }}
            >
              <GoogleIcon></GoogleIcon>&nbsp;&nbsp;Sign In with Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={handlePasswordResetClick}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link onClick={handleSignUpClick} href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default SignIn;
