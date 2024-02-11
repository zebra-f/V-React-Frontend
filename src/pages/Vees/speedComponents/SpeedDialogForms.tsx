import { useState, useEffect, forwardRef, ReactElement, Ref } from "react";

import { useMeasurementSystem } from "../../../shared/contexts/MeasurementSystem";

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
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface speedDialogFormsProps {
  setSpeedData: any;
  openAddIcon: boolean;
  setOpenAddIcon: any;
  openDistanceIcon: boolean;
  setOpenDistanceIcon: any;
  distance: number;
  setDistance: any;
}
export default function SpeedDialogForms({
  setSpeedData,
  openAddIcon,
  setOpenAddIcon,
  openDistanceIcon,
  setOpenDistanceIcon,
  distance,
  setDistance,
}: speedDialogFormsProps) {
  const [measurementSystem] = useMeasurementSystem();

  // Distance Form

  const [distanceForm, setDistanceForm] = useState<string>(() => `${distance}`);
  const [distanceUnit, setDistanceUnit] = useState<string>(() =>
    measurementSystem === "metric" ? "km" : "mi",
  );

  // set default unit
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
      // setDistance(Number(value));
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
        setSpeedData((prev: any) => {
          return measurementSystem === "metric"
            ? [
                ...prev,
                {
                  id: uuidv4(),
                  name: speedDataForm.name,
                  kmph: Number(speedDataForm.speed),
                  mph: Number(speedDataForm.speed) * 0.621371,
                  internal: true,
                },
              ]
            : [
                ...prev,
                {
                  id: uuidv4(),
                  name: speedDataForm.name,
                  kmph: Number(speedDataForm.speed) * 1.60934,
                  mph: Number(speedDataForm.speed),
                  internal: true,
                },
              ];
        });
        break;
    }
  };

  const handleAddIconClose = () => {
    setOpenAddIcon(false);
  };
  const handleDistanceIconClose = () => {
    setOpenDistanceIcon(false);
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
        <DialogTitle>{"Add as many as you like"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            (data entered here is stored in your local storage)
          </DialogContentText>
        </DialogContent>
        <Box
          display="flex"
          justifyContent="space-around"
          // my={2}
          sx={{
            "& .MuiTextField-root": { m: 0.5 },
          }}
          // component="form"
          // noValidate
          // autoComplete="off"
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
              mr: 1,
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
        <DialogContent></DialogContent>
        <Box display="flex" justifyContent="space-around">
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

        <DialogActions>
          <Button onClick={handleDistanceIconClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
