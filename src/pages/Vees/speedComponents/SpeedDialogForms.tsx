import { useState, useEffect, forwardRef, ReactElement, Ref } from "react";

import { useMeasurementSystem } from "../../../shared/contexts/MeasurementSystem";

import { useVeesSpeedData } from "../../../shared/contexts/VeesSpeedData";
import { veesSpeedDataInterface } from "../../../shared/contexts/VeesSpeedData";

import { v4 as uuidv4 } from "uuid";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions/";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface speedDialogFormsProps {
  distance: number;
  setDistance: any;
  openAddIcon: boolean;
  setOpenAddIcon: any;
  openDistanceIcon: boolean;
  setOpenDistanceIcon: any;
  openSettingsIcon: boolean;
  setOpenSettingsIcon: any;
  alwaysDisplayElapsedTime: boolean;
  setAlwaysDisplayElapsedTime: any;
  slideAppear: boolean;
  setSlideAppear: any;
}
export default function SpeedDialogForms({
  distance,
  setDistance,
  openAddIcon,
  setOpenAddIcon,
  openDistanceIcon,
  setOpenDistanceIcon,
  openSettingsIcon,
  setOpenSettingsIcon,
  alwaysDisplayElapsedTime,
  setAlwaysDisplayElapsedTime,
  slideAppear,
  setSlideAppear,
}: speedDialogFormsProps) {
  const [measurementSystem] = useMeasurementSystem();

  const [, setVeesSpeedData] = useVeesSpeedData();

  // Distance Form

  const [distanceForm, setDistanceForm] = useState<string>(() => `${distance}`);
  const [distanceUnit, setDistanceUnit] = useState<string>(() =>
    measurementSystem === "metric" ? "km" : "mi",
  );

  useEffect(() => {
    setDistanceUnit(measurementSystem === "metric" ? "km" : "mi");
  }, [measurementSystem]);

  const disabledUnitMetric = measurementSystem === "imperial" ? true : false;
  const disabledUnitImperial = measurementSystem === "metric" ? true : false;

  const handleUnitChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setDistanceUnit(value);

    switch (value) {
      case "km":
      case "mi":
        setDistance(Number(distanceForm));
        break;
      case "m":
        setDistance(Number(distanceForm) * 0.001);
        break;
      case "cm":
        setDistance(Number(distanceForm) * 0.00001);
        break;
      case "yd":
        setDistance(Number(distanceForm) * 0.000568);
        break;
      case "ft":
        setDistance(Number(distanceForm) * 0.000189394);
        break;
    }
  };

  const handleDistanceForm = (e: any) => {
    const value: string = e.target.value.trim();
    setDistanceForm((prev) => {
      if (value.toLowerCase() !== value.toUpperCase() || isNaN(value as any)) {
        return prev;
      }
      return e.target.value.trim();
    });
    if (!isNaN(value as any)) {
      switch (distanceUnit) {
        case "km":
        case "mi":
          setDistance(Number(value));
          break;
        case "m":
          setDistance(Number(value) * 0.001);
          break;
        case "cm":
          setDistance(Number(value) * 0.00001);
          break;
        case "yd":
          setDistance(Number(value) * 0.000568);
          break;
        case "ft":
          setDistance(Number(value) * 0.000189394);
          break;
      }
    }
  };

  function distanceUnitLabel() {
    switch (distanceUnit) {
      case "km":
        return "kilometres";
      case "m":
        return "metres";
      case "cm":
        return "centimetres";
      case "mi":
        return "miles";
      case "yd":
        return "yards";
      case "ft":
        return "feet";
      default:
        return "";
    }
  }

  // Speed Form

  const [speedDataForm, setSpeedDataForm] = useState(() => {
    return {
      name: "",
      speed: "",
    };
  });

  const handleSpeedDataForm = (e: any) => {
    let value = e.target.value.trim();
    if (e.target.name === "speed") {
      if (value.toLowerCase() == value.toUpperCase() && !isNaN(value as any)) {
        setSpeedDataForm({
          ...speedDataForm,
          [e.target.name]: e.target.value.trim(),
        });
      }
    } else {
      setSpeedDataForm({
        ...speedDataForm,
        [e.target.name]: e.target.value.trim(),
      });
    }
  };

  const addSpeedDataForm = () => {
    if (speedDataForm.name.length < 1) {
      // pass
    } else if (
      isNaN(speedDataForm.speed as any) ||
      speedDataForm.speed === ""
    ) {
      // pass
    } else {
      addSpeedData("Form");
      setSpeedDataForm({
        name: "",
        speed: "",
      });
    }
  };
  const handleAddSpeedDataForm = () => {
    addSpeedDataForm();
  };
  const handleEnterSpeedDataForm = (e: any) => {
    if (e.key == "Enter") {
      addSpeedDataForm();
    }
  };

  const addSpeedData = (calledBy: string) => {
    switch (calledBy) {
      case "Form":
        const localId = uuidv4();

        setVeesSpeedData((prev: Array<veesSpeedDataInterface>) => {
          return measurementSystem == "metric"
            ? [
                ...prev,
                {
                  local: true,
                  localSpeed: {
                    id: localId,
                    name: speedDataForm.name,
                    kmph: Number(speedDataForm.speed),
                    mph: Number(speedDataForm.speed) * 0.621371,
                  },
                  externalSpeed: null,
                },
              ]
            : [
                ...prev,
                {
                  local: true,
                  localSpeed: {
                    id: localId,
                    name: speedDataForm.name,
                    kmph: Number(speedDataForm.speed) * 1.60934,
                    mph: Number(speedDataForm.speed),
                  },
                  externalSpeed: null,
                },
              ];
        });

        break;
    }
  };

  // Settings

  const handleChangeElapsedTime = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAlwaysDisplayElapsedTime(event.target.checked);
  };
  const handleChangeSlideIn = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlideAppear(event.target.checked);
  };
  const handleAddIconClose = () => {
    setOpenAddIcon(false);
  };

  const handleDistanceIconClose = () => {
    setOpenDistanceIcon(false);
  };
  const handleSettingsIconClose = () => {
    setOpenSettingsIcon(false);
  };

  return (
    <>
      {/* Speed Form */}
      <Dialog
        open={openAddIcon}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAddIconClose}
        onKeyDown={handleEnterSpeedDataForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Quick data entry"}</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <Box
            display="flex"
            justifyContent="space-around"
            sx={{
              "& .MuiTextField-root": { m: 0.5 },
            }}
          >
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              name="name"
              onChange={handleSpeedDataForm}
              value={speedDataForm.name}
            />
            <TextField
              id="outlined-basic"
              label={
                measurementSystem == "metric" ? "Speed (km/h)" : "Speed (mph)"
              }
              variant="outlined"
              name="speed"
              onChange={handleSpeedDataForm}
              value={speedDataForm.speed}
            />
            <IconButton
              sx={{
                mt: 1,
                minHeight: "20px",
                minWidth: "20px",
                maxWidth: "50px",
                height: "100%",
                width: "20%",
              }}
              onClick={handleAddSpeedDataForm}
              color="success"
            >
              <AddBoxIcon fontSize="large" />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddIconClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Disntace Form */}
      <Dialog
        open={openDistanceIcon}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDistanceIconClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Set your preferred distance"}</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-around" mt={2}>
            <TextField
              id="outlined-basic"
              label={distanceUnitLabel()}
              variant="outlined"
              name="distance"
              onChange={handleDistanceForm}
              value={distanceForm}
              sx={{ ml: 1 }}
            />
            <FormControl
              sx={{
                ml: 1,
                mr: 1,
              }}
            >
              <InputLabel id="demo-simple-select-label">Unit</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={distanceUnit}
                label="Units"
                onChange={handleUnitChange}
              >
                <MenuItem value={"mi"} disabled={disabledUnitImperial}>
                  mi
                </MenuItem>
                <MenuItem value={"yd"} disabled={disabledUnitImperial}>
                  yd
                </MenuItem>
                <MenuItem value={"ft"} disabled={disabledUnitImperial}>
                  ft
                </MenuItem>
                <MenuItem value={"km"} disabled={disabledUnitMetric}>
                  km
                </MenuItem>
                <MenuItem value={"m"} disabled={disabledUnitMetric}>
                  m
                </MenuItem>
                <MenuItem value={"cm"} disabled={disabledUnitMetric}>
                  cm
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDistanceIconClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Settings */}
      <Dialog
        open={openSettingsIcon}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleSettingsIconClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Settings"}</DialogTitle>
        <DialogContent>
          <Box m={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={alwaysDisplayElapsedTime}
                  onChange={handleChangeElapsedTime}
                />
              }
              label="Always display elapsed time"
            />
            <FormControlLabel
              control={
                <Switch checked={slideAppear} onChange={handleChangeSlideIn} />
              }
              label="Enable Vees openning slide animation"
            />
          </Box>
          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsIconClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
