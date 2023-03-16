import { useState, useEffect } from "react";
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
import Switch, { SwitchProps } from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { v4 as uuidv4 } from "uuid";

import SpeedSVG from "./SpeedSVG";

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
  },
  {
    id: uuidv4(),
    name: "Human",
    kmph: 37.0,
    mph: 22.99,
  },
  {
    id: uuidv4(),
    name: "Lockheed Martin F-22 Raptor",
    kmph: 2414.0,
    mph: 1499.99,
  },

  {
    id: uuidv4(),
    name: "Earth",
    kmph: 107226.0,
    mph: 66627.12,
  },
  {
    id: uuidv4(),
    name: "Cheetah",
    kmph: 112.0,
    mph: 69.59,
  },
];

export default function Speed() {
  const [measurementSystem, setMeasurementSystem] = useState<
    "metric" | "imperial"
  >("metric");
  const [speedData, setSpeedData] = useState<
    {
      id: string;
      name: string;
      kmph: number;
      mph: number;
    }[]
  >(placeholderSpeedData);

  const [speedDataForm, setSpeedDataForm] = useState(() => {
    return {
      id: "",
      name: "",
      speed: "",
    };
  });
  const handleSpeedDataForm = (e: any) => {
    setSpeedDataForm({
      ...speedDataForm,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const handleAddSpeedDataForm = (e: any) => {
    if (speedDataForm.name.length < 1) {
      // pass
    } else if (isNaN(speedDataForm.speed as any)) {
      // pass
    } else {
      addSpeedData("Form");
    }
  };
  const handleDeleteDataFromList = (id: string, e: any) => {
    setSpeedData((prev) => {
      return prev.filter((d) => d.id !== id);
    });
  };
  const addSpeedData = (calledBy: string) => {
    switch (calledBy) {
      case "Form":
        setSpeedData((prev) => {
          return measurementSystem === "metric"
            ? [
                ...prev,
                {
                  id: uuidv4(),
                  name: speedDataForm.name,
                  kmph: Number(speedDataForm.speed),
                  mph: Number(speedDataForm.speed) * 0.621371,
                },
              ]
            : [
                ...prev,
                {
                  id: uuidv4(),
                  name: speedDataForm.name,
                  kmph: Number(speedDataForm.speed) * 1.60934,
                  mph: Number(speedDataForm.speed),
                },
              ];
        });
    }
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

  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Label placement</FormLabel>
        <FormGroup aria-label="position" row>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Off</Typography>
            <Switch
              defaultChecked
              inputProps={{ "aria-label": "ant design" }}
            />
            <Typography>On</Typography>
          </Stack>
        </FormGroup>
      </FormControl>

      <Grid mt={2} container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid xs={4} sm={8} md={8}>
          <SpeedSVG
            speedData={speedData}
            measurementSystem={measurementSystem}
          />
        </Grid>

        <Grid xs={4} sm={8} md={4}>
          <Box
            display="flex"
            justifyContent="center"
            my={2}
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              name="name"
              onChange={handleSpeedDataForm}
            />
            <TextField
              id="outlined-basic"
              label={
                measurementSystem == "metric" ? "Speed (km/h)" : "Speed (mph)"
              }
              variant="outlined"
              name="speed"
              onChange={handleSpeedDataForm}
            />
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                minHeight: "20px",
                minWidth: "70px",
                height: "100%",
                width: "20%",
              }}
              onClick={handleAddSpeedDataForm}
            >
              Add
            </Button>
          </Box>

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

          <Grid>
            <List dense={false}>
              {speedData.map((data, index) => {
                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => handleDeleteDataFromList(data.id, e)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${
                        data.name.length > 25
                          ? data.name.slice(0, 25) + "..."
                          : data.name
                      } ${
                        measurementSystem === "metric" ? data.kmph : data.mph
                      }`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </Grid>
    </>
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
