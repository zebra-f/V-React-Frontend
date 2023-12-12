import { useState, useEffect, forwardRef } from "react";

import useLocalStorageState from "use-local-storage-state";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Container from "@mui/material/Container";
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
import useTheme from "@mui/material/styles/useTheme";

import { v4 as uuidv4 } from "uuid";

import SpeedSVG from "./components/SpeedSVG";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Film {
  title: string;
  year: number;
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
const placeholderSpeedData: any[] = [
  {
    id: uuidv4(),
    name: "Mitsubishi 3000GT",
    kmph: 257.5,
    mph: 160.0,
    internal: true,
  },
  {
    id: uuidv4(),
    name: "Human",
    kmph: 37.0,
    mph: 22.99,
    internal: true,
  },
  {
    id: uuidv4(),
    name: "Lockheed Martin F-22 Raptor",
    kmph: 2414.0,
    mph: 1499.99,
    internal: true,
  },

  {
    id: uuidv4(),
    name: "Earth",
    kmph: 107226.0,
    mph: 66627.1475,
    internal: true,
  },
  {
    id: uuidv4(),
    name: "Cheetah",
    kmph: 112.0,
    mph: 69.59,
  },
];

interface AppProps {
  measurementSystem: "metric" | "imperial";
}

export default function Speed(props: AppProps) {
  const theme = useTheme();
  const [distance, setDistance] = useLocalStorageState<number>("distance", {
    defaultValue: 2,
  });
  const [distanceForm, setDistanceForm] = useState<string>(() => `${distance}`);
  const [distanceUnit, setDistanceUnit] = useState<string>(() =>
    props.measurementSystem === "metric" ? "km" : "mi"
  );

  useEffect(() => {
    setDistanceUnit(props.measurementSystem === "metric" ? "km" : "mi");
  }, [props.measurementSystem]);

  // set `Unit` form, input handle
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
  const disabledUnitMetric =
    props.measurementSystem === "imperial" ? true : false;
  const disabledUnitImperial =
    props.measurementSystem === "metric" ? true : false;

  // set `<distance>` form, input handle
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

  const [speedData, setSpeedData] = useLocalStorageState<
    {
      id: string;
      name: string;
      kmph: number;
      mph: number;
      internal: boolean;
    }[]
  >("speedData", {
    defaultValue: placeholderSpeedData,
  });
  const [speedDataForm, setSpeedDataForm] = useState(() => {
    return {
      name: "",
      speed: "",
    };
  });
  // set `Name` and `Speed (mph/kmph)` form, input handle
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
  const handleAddSpeedDataForm = (e: any) => {
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
        setSpeedData((prev) => {
          return props.measurementSystem === "metric"
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

  const handleDeleteDataFromList = (id: string) => {
    setSpeedData((prev) => {
      return prev.filter((d) => d.id !== id);
    });
  };

  // Seatching
  // Seatching
  // Seatching

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Film[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // SVG
  // SVG
  // SVG

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

  const [openAddIcon, setOpenAddIcon] = useState(false);
  const handleAddIconOpen = () => {
    setOpenAddIcon(true);
  };
  const handleAddIconClose = () => {
    setOpenAddIcon(false);
  };

  const [openDistanceIcon, setOpenDistanceIcon] = useState(false);
  const handleDistanceIconIconOpen = () => {
    setOpenDistanceIcon(true);
  };
  const handleDistanceIconClose = () => {
    setOpenDistanceIcon(false);
  };

  return (
    <Container maxWidth="xl">
      <Grid mt={4} container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid id={"svg"} xs={4} sm={8} md={8} boxShadow={5}>
          <SpeedSVG
            speedData={speedData}
            measurementSystem={props.measurementSystem}
            handleAddIconOpen={handleAddIconOpen}
            distance={distance}
            handleDistanceIconIconOpen={handleDistanceIconIconOpen}
          />
        </Grid>

        <Grid xs={4} sm={8} md={4}>
          <Box display="flex" justifyContent="center" my={2}>
            <Autocomplete
              id="asynchronous-demo"
              sx={{ width: 400 }}
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.title === value.title
              }
              getOptionLabel={(option) => option.title}
              options={options}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
          <Box display="flex" justifyContent="center" my={2}>
            <TableContainer
              sx={{
                pt: 0.84,
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "rgba(251, 254, 251, 0.6)"
                    : "rgba(9, 10, 15, 0.8)",
                borderBottom: `thin solid ${
                  theme.palette.mode === "light" ? "#3d5a80" : "#98c1d9"
                }}`,
              }}
            >
              <Table
                aria-label="simple table"
                stickyHeader
                padding="normal"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">
                      {props.measurementSystem === "metric" ? "kmph" : "mph"}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {speedData.map((d) => (
                    <TableRow
                      key={d.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {d.name}
                      </TableCell>
                      <TableCell align="right">
                        {props.measurementSystem === "metric"
                          ? Number.parseFloat(String(d.kmph)).toFixed(2)
                          : Number.parseFloat(String(d.mph)).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteDataFromList(d.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>

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
              props.measurementSystem == "metric"
                ? "Speed (km/h)"
                : "Speed (mph)"
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
    </Container>
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];
