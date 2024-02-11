import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useRedirectAuthenticatedUserEffect } from "../../../shared/hooks/useEffect";
import { useIsAuthenticated } from "../../../shared/contexts/IsAuthenticated";

import kyClient from "../../../shared/services/ky";
import signIn from "../../../actions/signIn";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InfoIcon from "@mui/icons-material/Info";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import useTheme from "@mui/material/styles/useTheme";
import Tooltip from "@mui/material/Tooltip";

interface signUpData {
  username: string;
  password?: string;
}
async function requestGoogleSignUp(data: signUpData) {
  try {
    const response: any = await kyClient.backendApi.post(
      "token/google/callback/",
      {
        json: data,
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

function GoogleSignUp() {
  const theme = useTheme();

  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useIsAuthenticated();
  useRedirectAuthenticatedUserEffect(isAuthenticated, "/");

  const [apiError, setApiError] = useState({
    error: false,
    errorMessage: "",
  });

  const [usernameError, setUsernameError] = useState({
    error: false,
    errorMessage: "",
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
    errorMessage: "",
  });

  const [checkboxCheckedError, setCheckboxCheckedError] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const handleCheckboxChange = (event: any) => {
    setCheckboxChecked(event.target.checked);
  };

  const [passwordCheckboxChecked, setPasswordCheckboxChecked] = useState(false);
  const handlePasswordCheckboxChange = (event: any) => {
    setPasswordCheckboxChecked(event.target.checked);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let username = data.get("username");
    let password = data.get("password");
    let confirmPassword = data.get("confirm-password");

    if (!username && !checkboxChecked) {
      setUsernameError({
        error: true,
        errorMessage: "This field is required.",
      });
      if (passwordCheckboxChecked && !password && !confirmPassword)
        setPasswordError({
          error: true,
          errorMessage: "This field is required.",
        });
      setCheckboxCheckedError(true);
      return;
    }

    let errorFlag = false;
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
        errorFlag = true;
      } else {
        setUsernameError({ error: false, errorMessage: "" });
      }
    }
    if (passwordCheckboxChecked) {
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
        }
      }
    }

    if (!checkboxChecked) {
      setCheckboxCheckedError(true);
      errorFlag = true;
    } else {
      setCheckboxCheckedError(false);
    }

    if (errorFlag) {
      return;
    }

    if (password && username) {
      username = username.toString().trim();
      password = password.toString();
    } else if (username) {
      username = username.toString().trim();
    } else {
      return;
    }

    let requestData: signUpData = { username: username };
    if (password) {
      requestData.password = password.toString().trim();
    }
    requestGoogleSignUp(requestData).then((result) => {
      if (result.status === 200) {
        setApiError({ error: false, errorMessage: "" });
        signIn(result.data.access, setIsAuthenticated);
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

  // Sign In
  const handleSignInLink = () => {
    navigate("/signin");
  };

  const handleResendLink = () => {
    navigate("/verifyemail");
  };

  const openTermsWindow = (url: string) => {
    window.open(url, "_blank");
  };
  return (
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
          Google Sign Up
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

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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

          <FormGroup>
            <FormControlLabel
              checked={passwordCheckboxChecked}
              onChange={handlePasswordCheckboxChange}
              control={<Checkbox size="small" />}
              label={
                <span style={{ fontSize: "0.8rem" }}>
                  {"Optional password "}{" "}
                  <Tooltip
                    title="For enhanced convenience, you can provide your password to sign in with your email directly, without having to access your Google account.
                             You can skip this step and add your password at any time in the future by clicking on 'Forgot password?' located within the 'Sign In' tab."
                  >
                    <InfoIcon sx={{ fontSize: "1.2rem" }} />
                  </Tooltip>
                </span>
              }
            />
          </FormGroup>
          <TextField
            margin="normal"
            fullWidth
            disabled={passwordCheckboxChecked ? false : true}
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
            fullWidth
            disabled={passwordCheckboxChecked ? false : true}
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="current-password"
            helperText={passwordError.error ? passwordError.errorMessage : ""}
            error={passwordError.error}
          />
          <FormGroup
            sx={checkboxCheckedError ? { color: theme.palette.error.main } : {}}
          >
            <FormControlLabel
              checked={checkboxChecked}
              onChange={handleCheckboxChange}
              required
              control={<Checkbox size="small" />}
              label={
                <span style={{ fontSize: "0.8rem" }}>
                  {"I agree to the "}{" "}
                  <Link
                    href="#"
                    onClick={() => openTermsWindow("https://example.com/terms")}
                    style={{ cursor: "pointer" }}
                  >
                    Terms of Service
                  </Link>
                </span>
              }
            />
          </FormGroup>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 0 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default GoogleSignUp;
