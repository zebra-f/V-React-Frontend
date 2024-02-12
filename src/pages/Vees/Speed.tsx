import { useState, useEffect } from "react";

import useLocalStorageState from "use-local-storage-state";

import { useVeesSpeedData } from "../../shared/contexts/VeesSpeedData";

import SpeedDisplayPanel from "./speedComponents/SpeedDisplayPanel";
import SpeedDialogForms from "./speedComponents/SpeedDialogForms";
import SpeedsTable from "./speedComponents/SpeedsTable";

import { v4 as uuidv4 } from "uuid";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";

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

export default function Speed() {
  const [veesSpeedData, setVeesSpeedData] = useVeesSpeedData();
  console.log(veesSpeedData);

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

  // Searching

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

  // Dialog Forms

  const [distance, setDistance] = useLocalStorageState<number>("distance", {
    defaultValue: 2,
  });

  const [openAddIcon, setOpenAddIcon] = useState(false);
  const handleAddIconOpen = () => {
    setOpenAddIcon(true);
  };

  const [openDistanceIcon, setOpenDistanceIcon] = useState(false);
  const handleDistanceIconIconOpen = () => {
    setOpenDistanceIcon(true);
  };

  return (
    <Container maxWidth="xl">
      <Grid mt={4} container={true} spacing={2}>
        <Grid id={"svg"} xs={12} sm={12} md={8}>
          <Box boxShadow={5} p={1}>
            <SpeedDisplayPanel
              speedData={speedData}
              handleAddIconOpen={handleAddIconOpen}
              distance={distance}
              handleDistanceIconIconOpen={handleDistanceIconIconOpen}
            />
          </Box>
        </Grid>

        <Grid xs={12} sm={12} md={4}>
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

          <SpeedsTable speedData={speedData} setSpeedData={setSpeedData} />
        </Grid>
      </Grid>

      <SpeedDialogForms
        setSpeedData={setSpeedData}
        openAddIcon={openAddIcon}
        setOpenAddIcon={setOpenAddIcon}
        openDistanceIcon={openDistanceIcon}
        setOpenDistanceIcon={setOpenDistanceIcon}
        distance={distance}
        setDistance={setDistance}
      />
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
