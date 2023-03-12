import * as React from "react";
import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Slider from "@mui/material/Slider";
import * as d3 from "d3";
import { select } from "d3";

interface Film {
  title: string;
  year: number;
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const placeholderData = [
  {
    name: "Mistsubishi 3000GT",
    speed: 257.5,
    color: "lime",
  },
  {
    name: "Human",
    speed: 37,
    color: "NavajoWhite ",
  },
  {
    name: "Lockheed Martin F-22 Raptor",
    speed: 2414,
    color: "pink",
  },

  {
    name: "Earth",
    speed: 107226,
    color: "lightblue",
  },
  {
    name: "Cheetah",
    speed: 112,
    color: "yellow",
  },
];

export default function Speed() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | d3.Selection<
    any,
    unknown,
    null,
    undefined
  >>(null);
  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      const s = selection
        .selectAll(".bar")
        .data(placeholderData)
        .attr("width", 0)
        .attr("height", 20)
        .attr("fill", (d) => d.color)
        .attr("y", (_, i) => i * 50)
        .attr("x", 80)
        .attr("style", "outline: thin solid red;")
        .text((d) => d.color)
        .transition()
        .ease(d3.easeLinear)
        .duration((d) => {
          // km
          const distance = 0.1;
          const timeHours = distance / d.speed;
          console.log(timeHours);
          const timeMiliseconds = timeHours * 3600000;
          return timeMiliseconds;
        })
        .attr("width", 960);
    }
    // d3.select(svgRef.current)
    //   .append("rect")
    //   .attr("width", 20)
    //   .attr("height", 20)
    //   .attr("fill", "lightblue");
    // d3.selectAll("rect")
    //   .attr("width", 20)
    //   .attr("height", 20)
    //   .attr("fill", "lightblue")
    //   .attr("y", (_, i) => {
    //     return i * 25;
    //   });
  }, [selection]);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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
              <rect className={"bar"}></rect>
              <rect className={"bar"}></rect>
              <defs>
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
                    stroke-width="0.5"
                  />
                </pattern>
                <pattern
                  id="grid"
                  width="79.92"
                  height="79.92"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="80" height="80" fill="url(#smallGrid)" />
                  <path
                    d="M 80 0 L 0 0 0 80"
                    fill="none"
                    stroke="gray"
                    stroke-width="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </Box>
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
