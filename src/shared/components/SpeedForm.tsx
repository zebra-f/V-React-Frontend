import { useState, forwardRef } from "react";

import {
  speedInterface,
  speedBaseInterface,
} from "../interfaces/speedInterfaces";

import kyClient from "../services/ky";

import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import HelpIcon from "@mui/icons-material/Help";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

async function addSpeedRequest(data: speedBaseInterface) {
  try {
    const response: any = await kyClient.backendApi.post("speeds/", {
      json: {
        name: data.name,
        description: data.description,
        speed_type: data.speed_type,
        tags: data.tags,
        kmph: data.kmph,
        estimated: data.estimated,
        is_public: data.is_public,
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
  setMeasurementSystem: React.Dispatch<
    React.SetStateAction<"metric" | "imperial">
  >;
  measurementSystem: "metric" | "imperial";
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  speedData: null | speedInterface;
  setSpeedFormResponseData: React.Dispatch<
    React.SetStateAction<speedInterface | null>
  >;
}
export default function SpeedForm({
  measurementSystem,
  setMeasurementSystem,
  formOpen,
  setFormOpen,
  speedData,
  setSpeedFormResponseData,
}: props) {
  const theme = useTheme();

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [speedAddedAlertMessage, setSpeedAddedAlertMessage] = useState("");
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
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

  const [estimatedChecked, setEstimatedChecked] = useState(false);
  const handleEstimatedCheckboxChange = (event: any) => {
    setEstimatedChecked(event.target.checked);
  };
  const [privateChecked, setPrivateChecked] = useState(false);
  const handlePrivateCheckboxChange = (event: any) => {
    setPrivateChecked(event.target.checked);
  };

  const [speedType, setSpeedType] = useState("Top");
  const handleSpeedTypeChange = (event: SelectChangeEvent) => {
    setSpeedType(event.target.value as string);
  };

  const [tags, setTags] = useState<Array<string>>(
    speedData !== null ? speedData.tags : [],
  );

  const [apiError, setApiError] = useState({
    error: false,
    errorMessage: "",
  });
  const [nameError, setNameError] = useState({
    error: false,
    errorMessage: "",
  });
  const [descriptionError, setDescriptionError] = useState({
    error: false,
    errorMessage: "",
  });
  const [speedError, setSpeedError] = useState({
    error: false,
    errorMessage: "",
  });
  const [tagsError, setTagsError] = useState({
    error: false,
    errorMessage: "",
  });
  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let name = data.get("name");
    let description = data.get("description");
    let unit = data.get("unit-radio-group");
    let kmph = data.get("speed");
    let speedType = data.get("speed-type-select");
    let estimatedCheckbox = data.get("estimated-checkbox");
    let privateCheckbox = data.get("private-checkbox");

    let errorFlag = false;

    if (!name) {
      setNameError({ error: true, errorMessage: "This field is required" });
      errorFlag = true;
    } else {
      setNameError({ error: false, errorMessage: "" });
    }

    if (!description) {
      setDescriptionError({
        error: true,
        errorMessage: "This field is required",
      });
      errorFlag = true;
    } else {
      setDescriptionError({
        error: false,
        errorMessage: "",
      });
    }

    if (!kmph) {
      setSpeedError({ error: true, errorMessage: "This field is required." });
      errorFlag = true;
    } else {
      if (isNaN(kmph.toString().trim() as any)) {
        setSpeedError({
          error: true,
          errorMessage: "A valid number is required",
        });
        errorFlag = true;
      } else {
        setSpeedError({ error: false, errorMessage: "" });
      }
    }

    if (tags.length > 4) {
      setTagsError({
        error: true,
        errorMessage: "The list can have a maximum of 4 items.",
      });
    } else {
      let tagsFlag = false;
      tags.forEach((tag) => {
        if (tag.length > 20) {
          setTagsError({
            error: true,
            errorMessage:
              "Tag length exceeds the maximum limit. Each tag can have a maximum of 20 characters.",
          });
          errorFlag = true;
          tagsFlag = true;
        }
      });
      if (!tagsFlag) {
        setTagsError({ error: false, errorMessage: "" });
      }
    }

    if (errorFlag) {
      return;
    }

    if (name && description && kmph && unit && speedType) {
      name = name.toString().trim();
      description = description.toString().trim();
      kmph = kmph.toString().trim();
      unit = unit.toString().trim();
      speedType = speedType.toString().trim();
    } else {
      return;
    }

    const requestData: speedBaseInterface = {
      description: description,
      estimated: estimatedCheckbox !== null ? true : false,
      is_public: privateCheckbox !== null ? false : true,
      kmph: unit === "kmph" ? Number(kmph) : Number(kmph) * 1.609344,
      speed_type: speedType.toLowerCase(),
      name: name,
      tags: tags,
    };

    addSpeedRequest(requestData).then((result) => {
      if (result.status === 201) {
        (document.getElementById("name") as HTMLInputElement).value = "";
        (document.getElementById("description") as HTMLInputElement).value = "";
        (document.getElementById("speed") as HTMLInputElement).value = "";

        setSpeedAddedAlertMessage(
          "Success! You can close this form or add more speeds.",
        );
        setSuccessSnackbarOpen(true);

        setSpeedFormResponseData(result.data);

        setApiError({ error: false, errorMessage: "" });
      } else {
        const data = result.data;

        if (result.status == 400) {
          if ("name" in data) {
            setNameError({
              error: true,
              errorMessage: data.name,
            });
            errorFlag = true;
          }
          if ("description" in data) {
            setDescriptionError({
              error: true,
              errorMessage: data.description,
            });
            errorFlag = true;
          }
          if ("kmph" in data) {
            setSpeedError({
              error: true,
              errorMessage: data.password,
            });
            errorFlag = true;
          }
          if ("tags" in data) {
            setTagsError({
              error: true,
              errorMessage: data.tags,
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
                id="name"
                label="Name"
                name="name"
                autoFocus
                defaultValue={speedData ? speedData.name : null}
                helperText={nameError.error ? nameError.errorMessage : ""}
                error={nameError.error}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                defaultValue={speedData ? speedData.description : null}
                helperText={
                  descriptionError.error ? descriptionError.errorMessage : ""
                }
                error={descriptionError.error}
              />

              <Box sx={{ flexGrow: 2 }}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="unit-radio-group"
                    value={measurementSystem === "metric" ? "kmph" : "mph"}
                    name="unit-radio-group"
                    row
                  >
                    <FormControlLabel
                      value="kmph"
                      control={<Radio />}
                      label="kmph"
                      onClick={() => {
                        setMeasurementSystem("metric");
                      }}
                    />
                    <FormControlLabel
                      value="mph"
                      control={<Radio />}
                      label="mph"
                      onClick={() => {
                        setMeasurementSystem("imperial");
                      }}
                    />
                  </RadioGroup>
                </FormControl>
                <Grid container spacing={1}>
                  <Grid xs={7}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="speed"
                      label={
                        measurementSystem === "metric"
                          ? "Speed (kmph)"
                          : "Speed (mph)"
                      }
                      id="speed"
                      sx={{ mt: 0 }}
                      defaultValue={
                        speedData != null
                          ? measurementSystem === "metric"
                            ? speedData.kmph
                            : (speedData.kmph * 0.621371).toFixed(2)
                          : null
                      }
                      helperText={
                        speedError.error ? speedError.errorMessage : ""
                      }
                      error={speedError.error}
                    />
                  </Grid>
                  <Grid xs={5}>
                    <FormControl fullWidth>
                      <InputLabel id="speed-type-select-label">
                        Speed Type
                      </InputLabel>
                      <Select
                        labelId="speed-type-select-label"
                        id="speed-type-select"
                        value={speedType}
                        label="Speed Type"
                        name="speed-type-select"
                        onChange={handleSpeedTypeChange}
                      >
                        <MenuItem value={"Top"}>Top</MenuItem>
                        <MenuItem value={"Average"}>Average</MenuItem>
                        <MenuItem value={"Relative"}>Relative</MenuItem>
                        <MenuItem value={"Constant"}>Constant</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <FormGroup>
                <FormControlLabel
                  checked={estimatedChecked}
                  onChange={handleEstimatedCheckboxChange}
                  control={<Checkbox size="medium" />}
                  label={
                    <span>
                      Estimated&nbsp;
                      <Tooltip
                        enterTouchDelay={0}
                        leaveTouchDelay={4000}
                        title={
                          <Typography fontSize={20}>
                            Check this box to indicates that the values are not
                            directly measured but are approximations or
                            predictions. For example, it might represent the
                            estimated top speed of a T-Rex running.
                          </Typography>
                        }
                      >
                        <HelpIcon fontSize="small" />
                      </Tooltip>
                    </span>
                  }
                  name="estimated-checkbox"
                />
                <FormControlLabel
                  checked={privateChecked}
                  onChange={handlePrivateCheckboxChange}
                  control={<Checkbox size="medium" />}
                  label={
                    <span>
                      Private&nbsp;
                      <Tooltip
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                        title={
                          <Typography fontSize={20}>
                            Check this box to ensure that the added 'Speed' data
                            remains private and accessible only for you.
                          </Typography>
                        }
                      >
                        <HelpIcon fontSize="small" />
                      </Tooltip>
                    </span>
                  }
                  name="private-checkbox"
                />
              </FormGroup>
              <Box>
                <Autocomplete
                  sx={{ mt: 1 }}
                  multiple
                  id="tags"
                  options={[]}
                  value={tags}
                  freeSolo
                  onChange={(_, tags: Array<string>) => {
                    setTags(tags);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id={"tags-text-field"}
                      variant="outlined"
                      label="Tags"
                      required
                      helperText={tagsError.error ? tagsError.errorMessage : ""}
                      error={tagsError.error}
                    />
                  )}
                />
                <Typography variant="subtitle2" gutterBottom>
                  To improve search results and enhance the data with additional
                  context, consider adding relevant tags. While not obligatory,
                  it is recommended for better categorization and
                  discoverability. Simply type a word and press 'Enter' to add
                  tags (up to 4).
                </Typography>
              </Box>
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
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseForm}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
