import { useState, forwardRef } from "react";

import { speedInterface } from "../interfaces/speedInterfaces";

import kyClient from "../services/ky";

import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions/";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import HelpIcon from "@mui/icons-material/Help";
import ReportIcon from "@mui/icons-material/Report";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

async function reportRequest(data: {
  speed: string & { isUUID: true };
  detail: string;
  report_reason: string;
}) {
  try {
    const response: any = await kyClient.backendApi.post("speed-report/", {
      json: {
        speed: data.speed,
        detail: data.detail,
        report_reason: data.report_reason,
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
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  speedData: null | speedInterface;
}
export default function ReportForm({
  formOpen,
  setFormOpen,
  speedData,
}: props) {
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [speedAddedAlertMessage, setSpeedAddedAlertMessage] = useState("");
  const handleCloseAlert = (
    _: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const [detailValue, setDetailValue] = useState("");
  const handleDetailChange = (event: any) => {
    setDetailValue(event.target.value as string);
  };
  const [reportReason, setReportReason] = useState("spam");
  const handleReportReasonChange = (event: SelectChangeEvent) => {
    setReportReason(event.target.value as string);
  };

  const [apiError, setApiError] = useState({
    error: false,
    errorMessage: "",
  });
  const [detailError, setDetailError] = useState({
    error: false,
    errorMessage: "",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let detail = data.get("detail");
    let reportReason = data.get("report-reason-select");

    let errorFlag = false;

    if (!detail) {
      setDetailError({ error: true, errorMessage: "This field is required" });
      errorFlag = true;
    } else {
      setDetailError({ error: false, errorMessage: "" });
    }

    if (errorFlag || !speedData) {
      return;
    }

    if (detail && reportReason) {
      detail = detail.toString().trim();
      // replace newlines characters with the spaces
      detail = detail.replace(/\n/g, " ");
      reportReason = reportReason.toString().trim();
    } else {
      return;
    }

    const requestData = {
      speed: speedData.id,
      detail: detail,
      report_reason: reportReason.toLowerCase(),
    };
    reportRequest(requestData).then((result) => {
      if (result.status === 201) {
        (document.getElementById("detail") as HTMLInputElement).value = "";

        setSpeedAddedAlertMessage(
          "Thank you for reporting! Your vigilance makes a difference.",
        );
        setSuccessSnackbarOpen(true);

        setApiError({ error: false, errorMessage: "" });
        setTimeout(() => {
          setFormOpen(false);
        }, 4000);
      } else {
        const data = result.data;

        if (result.status == 400) {
          if ("detail" in data) {
            setDetailError({
              error: true,
              errorMessage: data.detail,
            });
            errorFlag = true;
          }
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
      <Dialog
        open={formOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={successSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          sx={{ mt: 6 }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            {speedAddedAlertMessage}
          </Alert>
        </Snackbar>

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
              <ReportIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Report
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
              sx={{ mt: 1, width: "20em" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="detail"
                name="detail"
                value={detailValue}
                onChange={handleDetailChange}
                autoFocus
                label={
                  <span>
                    Detail&nbsp;
                    <Tooltip
                      enterTouchDelay={0}
                      leaveTouchDelay={4000}
                      title={
                        <Typography fontSize={20}>
                          Include specific details to improve the review
                          process. Your input is invaluable!
                        </Typography>
                      }
                    >
                      <HelpIcon fontSize="small" />
                    </Tooltip>
                  </span>
                }
                helperText={detailError.error ? detailError.errorMessage : ""}
                error={detailError.error}
                multiline={true}
                rows={4}
                maxRows={4}
                sx={{ mb: 0, pb: 0 }}
              />
              <Box display="flex" justifyContent={"flex-end"}>
                <Typography
                  variant="caption"
                  gutterBottom
                  color={256 - detailValue.length < 0 ? "red" : ""}
                >
                  {256 - detailValue.length}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 2, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="report-reason-select-label">
                    Report Reason
                  </InputLabel>
                  <Select
                    labelId="report-reason-select-label"
                    id="report-reason-select"
                    value={reportReason}
                    label="Speed Type"
                    name="report-reason-select"
                    onChange={handleReportReasonChange}
                  >
                    <MenuItem value={"spam"}>Spam</MenuItem>
                    <MenuItem value={"incorrect data"}>Incorrect Data</MenuItem>
                    <MenuItem value={"non english"}>Non English</MenuItem>
                    <MenuItem value={"inappropriate language"}>
                      Inappriopriate Language
                    </MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 0 }}
              >
                Report
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseForm}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
