import * as React from "react";
import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import * as d3 from "d3";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonGroup from "@mui/material/ButtonGroup";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Slider from "@mui/material/Slider";

import { v4 as uuidv4 } from "uuid";

interface Film {
  title: string;
  year: number;
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
const placeholderSpeedData = [
  {
    id: uuidv4(),
    name: "Mistsubishi 3000GT",
    speed: 257.5,
  },
  {
    id: uuidv4(),
    name: "Human",
    speed: 37,
  },
  {
    id: uuidv4(),
    name: "Lockheed Martin F-22 Raptor",
    speed: 2414,
  },

  {
    id: uuidv4(),
    name: "Earth",
    speed: 107226,
  },
  {
    id: uuidv4(),
    name: "Cheetah",
    speed: 112,
  },
];

export default function Speed() {
  console.log("render!");
  const [speedData, setSpeedData] = useState(placeholderSpeedData);
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
          return [
            ...prev,
            {
              id: uuidv4(),
              name: speedDataForm.name,
              speed: Number(speedDataForm.speed),
            },
          ];
        });
    }
  };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | d3.Selection<
    any,
    unknown,
    null,
    undefined
  >>(null);
  const [barsSelection, setBarsSelection] = useState<null | d3.Selection<
    d3.BaseType | SVGRectElement,
    {
      id: string;
      name: string;
      speed: number;
    },
    d3.BaseType,
    unknown
  >>(null);

  const t = () => {
    function stopWatch(elapsed: number) {
      let minutes = Math.floor(elapsed / 60000);
      let seconds = ((elapsed % 60000) / 1000).toFixed(2);
      let oneHundredth = seconds.slice(-2);
      seconds = seconds[1] === "." ? seconds[0] : seconds.slice(0, 2);
      return seconds === "60"
        ? minutes < 10
          ? "0" + minutes + 1 + ":00" + ":" + oneHundredth
          : minutes + 1 + ":00" + ":" + oneHundredth
        : minutes < 10
        ? "0" +
          minutes +
          ":" +
          (Number(seconds) < 10 ? "0" : "") +
          seconds +
          ":" +
          oneHundredth
        : minutes +
          ":" +
          (Number(seconds) < 10 ? "0" : "") +
          seconds +
          ":" +
          oneHundredth;
    }
    const t = d3.timer((elapsed) => {
      if (elapsed > 2000000) {
        t.stop();
      } else {
        d3.select(".timer").text(stopWatch(elapsed));
      }
    }, 150);
    return t;
  };
  const [timer, setTimer] = useState<d3.Timer | null>(null);

  useEffect(() => {
    if (!selection) {
      setSelection(d3.select(svgRef.current));
    } else {
      selection.attr("style", "outline: thin solid #000000;");
      const speedChart = selection.select(".SpeedChart");
      const speedChartBars = speedChart
        .selectAll("rect")
        .data(speedData)
        .join("rect")
        .attr("width", 0)
        .attr("height", 40)
        .attr("fill", (_) => {
          return "#" + Math.floor(Math.random() * 16777215).toString(16);
        })
        .attr("y", (_, i) => i * 50)
        .attr("x", 80)
        // .attr("style", "outline: thin solid red;")
        .style("pointer-events", "visible")
        .on("click", (e, d) => {
          console.log("clicked on bar");
        });

      // const timer = selection.select(".timer");

      setBarsSelection(speedChartBars);
    }
  }, [selection, speedData]);

  function handleResetButton() {
    if (barsSelection) {
      barsSelection
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .attr("width", 0);
    }
    if (timer) {
      timer.stop();
      setTimer(null);
      // d3.select(".timer").text("00:00");
    }
  }

  function handleStartButton() {
    if (timer) {
      // pass
    } else if (barsSelection) {
      setTimer(t());
      barsSelection
        .transition()
        .ease(d3.easeLinear)
        .duration((d) => {
          // km
          const distance = 1;
          const timeHours = distance / d.speed;
          const timeMiliseconds = timeHours * 3600000;
          return timeMiliseconds;
        })
        .attr("width", 960)
        .on("end", () => {});
    }
  }

  // Seatching
  // Seatching
  // Seatching
  // Seatching
  // Seatching
  // Seatching
  // Seatching
  // Seatching
  // Seatching

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Film[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const [dense, setDense] = React.useState(false);

  function test() {
    console.log(222222);
  }

  return (
    <>
      <Grid mt={2} container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid xs={4} sm={8} md={8}>
          <Box display="flex" justifyContent="center" my={2}>
            <svg
              id="speed-chart"
              viewBox={`0 0 ${960} ${400}`}
              preserveAspectRatio="xMidYMid meet"
              ref={svgRef}
            >
              <g className="SpeedChart"></g>
              <text fontSize={50} x="700" y="370" className="timer"></text>
              {/* <defs>
              
                <pattern
                  id="smallGrid"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 8 0 L 0 0 0 8"
                    fill="none"
                    stroke="gray"
                    strokeWidth="0.5"
                  />
                </pattern>
                <pattern
                  id="grid"
                  width="79.93"
                  height="79.93"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="80" height="80" fill="url(#smallGrid)" />
                  <path
                    d="M 80 0 L 0 0 0 80"
                    fill="none"
                    stroke="gray"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" /> */}
            </svg>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <ButtonGroup
              size="small"
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
            >
              <Button size="small" onClick={handleStartButton}>
                Start
                <PlayArrowIcon />
              </Button>
              <Button size="small" onClick={handleResetButton}>
                Reset
                <RestartAltIcon />
              </Button>
            </ButtonGroup>

            <Slider
              sx={{ ml: 2 }}
              aria-label="Always visible"
              defaultValue={80}
              // getAriaValueText={valuetext}
              step={10}
              // marks={marks}
              valueLabelDisplay="on"
            />
          </Box>
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
              label="Speed (km/h)"
              variant="outlined"
              name="speed"
              onChange={handleSpeedDataForm}
            />
            <Button
              variant="contained"
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
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Grid>
            <List dense={dense}>
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
                    <ListItemText primary={`${data.name} ${data.speed}`} />
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
