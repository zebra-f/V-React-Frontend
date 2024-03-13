import { useState, useEffect, useRef } from "react";

import { getAndPrepareMeilisearchSpeedsData } from "../../shared/services/speeds/getMeilisearchData";

import { speedInterface } from "../../shared/interfaces/speedInterfaces";

import useLocalStorageState from "use-local-storage-state";

import { v4 as uuidv4, validate } from "uuid";

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
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [options, setOptions] = useState<readonly speedInterface[]>([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const queryMade = useRef(false);
  const loading =
    openAutocomplete && options.length === 0 && !queryMade.current;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (() => {
      // await sleep(200); // For demo purposes.

      if (active && autocompleteValue === "") {
        getAndPrepareMeilisearchSpeedsData("").then((response) => {
          if (response.status === 200) {
            setOptions([...response.results]);
            queryMade.current = true;
          } else {
            setOptions([]);
          }
        });
      } else if (active) {
        getAndPrepareMeilisearchSpeedsData(autocompleteValue).then(
          (response) => {
            if (response.status === 200) {
              setOptions([...response.results]);
              queryMade.current = true;
            } else {
              setOptions([]);
            }
          },
        );
      }
    })();

    return () => {
      active = false;
      queryMade.current = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!openAutocomplete) {
      setOptions([]);
      queryMade.current = false;
    }
  }, [openAutocomplete]);

  const debounce = (callback: any, wait: number) => {
    let timeoutId: any = null;
    return (...args: any) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait);
    };
  };
  const meiliSearch = debounce((event: any, value: any, reason: any) => {
    if (reason !== "input") {
      return;
    }
    setAutocompleteValue(value);
    getAndPrepareMeilisearchSpeedsData(value).then((response) => {
      if (response.status === 200) {
        setOptions(response.results);
      }
      queryMade.current = true;
    });
  }, 200);

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
                freeSolo
                id="go-meilisearch"
                sx={{ width: 400 }}
                open={openAutocomplete}
                onOpen={() => {
                  setOpenAutocomplete(true);
                }}
                onClose={() => {
                  setOpenAutocomplete(false);
                }}
                // isOptionEqualToValue={(option, value) => {
                //   console.log("option:", option, "value:", value);
                //   return option.name === value.name;
                // }}
                filterOptions={(options, _) => options}
                getOptionLabel={(option: any) => {
                  return option.name;
                }}
                options={options}
                loading={loading}
                getOptionKey={(option: any) => {
                  return option.id;
                }}
                autoHighlight={true}
                onChange={(_, value) => {
                  if (value) {
                    console.log(value);
                  }
                }}
                onInputChange={meiliSearch}
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
