import { useState, useEffect, useRef, forwardRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { getAndPrepareSpeedsData } from "../../shared/services/speeds/getData";
import {
  speedInterface,
  speedQueryParams,
} from "../../shared/interfaces/speedInterfaces";

import ApiError from "../../shared/components/ApiError";
import SpeedsTable from "../../shared/components/SpeedsTable";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import Collapse from "@mui/material/Collapse";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import CancelIcon from "@mui/icons-material/Cancel";

function getQueryParams(searchParams: any): speedQueryParams {
  let queryParams: speedQueryParams = {
    page: 1,
    isPublic: null,
    userName: null,
    speedType: null,
    speedTags: null,
  };

  type keyValuePair = [string, string | any];
  for (const entry of searchParams.entries()) {
    const [key, val]: keyValuePair = entry;
    if (key === "tags") {
      if (!queryParams["speedTags"]) {
        queryParams["speedTags"] = [];
      }
      queryParams["speedTags"].push(...val.split(","));
    }
    if (key === "speed_type") {
      if (["constant", "relative", "top", "average"].indexOf(val) !== -1) {
        queryParams["speedType"] = val;
      }
    }
  }

  return queryParams;
}

export default function SpeedsList() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

  const [searchParams] = useSearchParams();
  // initial load sets searchParams as default queryParams
  const [queryParams, setQueryParams] = useState<speedQueryParams>(
    getQueryParams(searchParams),
  );
  // prevents initial laod to setQueryParams for the 2nd time
  const initialLoad = useRef(true);
  useEffect(() => {
    if (!initialLoad.current) {
      setQueryParams(getQueryParams(searchParams));
    }
    initialLoad.current = false;
  }, [searchParams]);

  const [speedType, setSpeedType] = useState(
    queryParams.speedType ? queryParams.speedType : "",
  );
  const handleSpeedTypeChange = (event: SelectChangeEvent) => {
    setSpeedType(event.target.value as any);
  };
  const [tagsError, setTagsError] = useState({
    error: false,
    errorMessage: "",
  });
  const [tags, setTags] = useState<Array<string>>(
    queryParams.speedTags ? queryParams.speedTags : [],
  );

  const handleFilterForm = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let speedType = data.get("speed-type-select");

    let errorFlag = false;
    if (tags.length > 4) {
      setTagsError({
        error: true,
        errorMessage: "The list can have a maximum of 4 items.",
      });
      errorFlag = true;
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
        for (let i = 0; i < tag.length; i++) {
          const char = tag[i];
          if (!/^[a-zA-Z0-9,'']$/.test(char)) {
            setTagsError({
              error: true,
              errorMessage:
                "Tags must consist of letters (both uppercase and lowercase), numbers, and the following symbols (excluding the next dot): ' - .",
            });
            errorFlag = true;
            tagsFlag = true;
          }
        }
      });
      if (!tagsFlag) {
        setTagsError({ error: false, errorMessage: "" });
      }
    }

    if (errorFlag) {
      return;
    }

    let queryParamsString = "?";
    if (speedType) {
      speedType = speedType.toString().trim().toLowerCase();
      queryParamsString += "speed_type=" + speedType;
    }

    if (tags.length > 0) {
      queryParamsString += "&tags=" + tags.join(",");
    }
    navigate(queryParamsString);
  };

  const [count, setCount] = useState(0);
  const [results, setResults] = useState<Array<speedInterface>>([]);

  useEffect(() => {
    getAndPrepareSpeedsData(queryParams, false).then((result) => {
      if (result.status === 200) {
        setCount(result.count);
        setResults(result.results);
        setApiError({ error: false, errorMessage: "" });
      } else if (result.status >= 500) {
        setApiError({ error: true, errorMessage: "Something went wrong." });
      } else if (result.status >= 400) {
        setApiError({
          error: true,
          errorMessage: result.data
            ? result.data
            : "Something went wrong, try again later.",
        });
      }
    });
  }, [queryParams]);

  const [filterFormOpen, setFilterFormOpen] = useState(false);
  const handleCloseFilterForm = () => {
    setFilterFormOpen(false);
  };

  return (
    <>
      <Container>
        <ApiError apiError={apiError} setApiError={setApiError} />

        <Collapse in={filterFormOpen}>
          <Grid container spacing={2}>
            <Grid xs={12} md={8}></Grid>
            <Grid xs={12} md={4}>
              <Box
                component="form"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                onSubmit={handleFilterForm}
                noValidate
                sx={{ mt: 4 }}
              >
                <Box display="flex">
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
                  {speedType && (
                    <Button
                      onClick={() => {
                        setSpeedType("");
                      }}
                    >
                      <CancelIcon />
                    </Button>
                  )}
                </Box>
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
                <Button type="submit" variant="contained" sx={{ mt: 1, mb: 0 }}>
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Collapse>

        <Box mt={3}>
          {filterFormOpen ? (
            <Button variant="outlined" onClick={handleCloseFilterForm}>
              <FilterListOffIcon />
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={() => {
                setFilterFormOpen(true);
              }}
            >
              <FilterListIcon />
            </Button>
          )}
        </Box>

        <SpeedsTable
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          results={results}
          setResults={setResults}
          count={count}
          setCount={setCount}
          isEditable={false}
          rowType={"regular"}
        />
      </Container>
    </>
  );
}
