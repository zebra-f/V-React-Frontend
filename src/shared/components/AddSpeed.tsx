import { useState, forwardRef } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions/";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import useTheme from "@mui/material/styles/useTheme";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// <TextField
//   margin="normal"
//   required
//   fullWidth
//   id="username"
//   label="Username"
//   name="username"
//   autoComplete="username"
//   autoFocus
//   helperText={usernameError.error ? usernameError.errorMessage : ""}
//   error={usernameError.error}
// />;

export default function AddSpeed() {
  const theme = useTheme();

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const handleAddSpeed = () => {
    setFormOpen(true);
  };
  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const [apiError, setApiError] = useState({
    error: false,
    errorMessage: "",
  });

  const [estimatedChecked, setEstimatedChecked] = useState(false);
  const handleEstimatedCheckboxChange = (event: any) => {
    setEstimatedChecked(event.target.checked);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let username = data.get("username");
    let email = data.get("email");
    let password = data.get("password");
    let confirmPassword = data.get("confirm-password");
  };
  return (
    <>
      <Button variant="contained" color="success" onClick={handleAddSpeed}>
        ADD MORE SPEEDS &nbsp;&nbsp; <CloudUploadIcon />
      </Button>
      <Dialog
        open={formOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <CloudUploadIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add Speed
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
              />
              <FormGroup
                sx={estimatedChecked ? { color: theme.palette.error.main } : {}}
              >
                <FormControlLabel
                  checked={estimatedChecked}
                  onChange={handleEstimatedCheckboxChange}
                  control={<Checkbox size="medium" />}
                  label={<span>Estimated</span>}
                />
                <FormControlLabel
                  checked={estimatedChecked}
                  onChange={handleEstimatedCheckboxChange}
                  control={<Checkbox size="medium" />}
                  label={<span>Private</span>}
                />
              </FormGroup>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 0 }}
              >
                Add
              </Button>
            </Box>
          </Box>
          <DialogContentText mt={2}>
            (data entered here is will be available on your account)
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseForm}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
