import { useState, useEffect } from "react";

import useLocalStorageState from "use-local-storage-state";

import SpeedDisplayPanel from "./speedComponents/SpeedDisplayPanel";
import SpeedDialogForms from "./speedComponents/SpeedDialogForms";
import SpeedsTable from "./speedComponents/SpeedsTable";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";

interface Film {
  title: string;
  year: number;
}
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Speed() {
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
  const handleDistanceIconOpen = () => {
    setOpenDistanceIcon(true);
  };

  const [openSettingsIcon, setOpenSettingsIcon] = useState(false);
  const handleSettingsIconOpen = () => {
    setOpenSettingsIcon(true);
  };

  const [alwaysDisplayElapsedTime, setAlwaysDisplayElapsedTime] =
    useState<boolean>(false);

  const [slideAppear, setSlideAppear] = useLocalStorageState<true | false>(
    "slideAppear",
    {
      defaultValue: true,
    },
  );
  return (
    <Container maxWidth="xl">
      <Grid mt={4} container={true} spacing={2}>
        <Grid id={"svg"} xs={12} sm={12} md={8}>
          <Box boxShadow={5} p={1}>
            <SpeedDisplayPanel
              distance={distance}
              alwaysDisplayElapsedTime={alwaysDisplayElapsedTime}
              handleAddIconOpen={handleAddIconOpen}
              handleDistanceIconOpen={handleDistanceIconOpen}
              handleSettingsIconOpen={handleSettingsIconOpen}
              slideAppear={slideAppear}
            />
          </Box>
        </Grid>

        <Grid xs={12} sm={12} md={4}>
          <Box display="flex" justifyContent="center" my={2}>
            <Slide
              appear={slideAppear}
              in={true}
              direction="left"
              mountOnEnter
              unmountOnExit
            >
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
            </Slide>
          </Box>

          <SpeedsTable slideAppear={slideAppear} />
        </Grid>
      </Grid>

      <SpeedDialogForms
        distance={distance}
        setDistance={setDistance}
        openAddIcon={openAddIcon}
        setOpenAddIcon={setOpenAddIcon}
        openDistanceIcon={openDistanceIcon}
        setOpenDistanceIcon={setOpenDistanceIcon}
        openSettingsIcon={openSettingsIcon}
        setOpenSettingsIcon={setOpenSettingsIcon}
        alwaysDisplayElapsedTime={alwaysDisplayElapsedTime}
        setAlwaysDisplayElapsedTime={setAlwaysDisplayElapsedTime}
        slideAppear={slideAppear}
        setSlideAppear={setSlideAppear}
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
