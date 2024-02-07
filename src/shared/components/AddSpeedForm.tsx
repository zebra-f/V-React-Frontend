import { useState, forwardRef } from "react";

import { speedInterface } from "../interfaces/speedInterfaces";

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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface props {
  setMeasurementSystem: React.Dispatch<
    React.SetStateAction<"metric" | "imperial">
  >;
  measurementSystem: "metric" | "imperial";
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  speedData: null | speedInterface;
}
export default function AddSpeedForm({
  measurementSystem,
  setMeasurementSystem,
  formOpen,
  setFormOpen,
  speedData,
}: props) {
  const theme = useTheme();

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

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let name = data.get("name");
    let description = data.get("description");
    let unit = data.get("unit-radio-group");
    let speed = data.get("speed");
    let speedType = data.get("speed-type-select");
    let estimatedCheckbox = data.get("estimated-checkbox");
    let privateCheckbox = data.get("private-checkbox");
    console.log(
      name,
      description,
      speed,
      unit,
      speedType,
      estimatedCheckbox,
      privateCheckbox,
      tags,
    );
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                defaultValue={speedData ? speedData.description : null}
              />

              <Box sx={{ flexGrow: 2 }}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="unit-radio-group"
                    defaultValue={
                      measurementSystem === "metric" ? "kmph" : "mph"
                    }
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
                      type="number"
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
                  label={<span>Estimated</span>}
                  name="estimated-checkbox"
                />
                <FormControlLabel
                  checked={privateChecked}
                  onChange={handlePrivateCheckboxChange}
                  control={<Checkbox size="medium" />}
                  label={<span>Private</span>}
                  name="private-checkbox"
                />
              </FormGroup>
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
                    variant="outlined"
                    label="Tags"
                    required
                  />
                )}
              />
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
