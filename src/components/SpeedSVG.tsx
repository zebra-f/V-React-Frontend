import { useState, useEffect, useRef, useContext } from "react";

import * as d3 from "d3";

import useLocalStorageState from "use-local-storage-state";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import StraightenIcon from "@mui/icons-material/Straighten";
import useTheme from "@mui/material/styles/useTheme";

interface SpeedProps {
  speedData: {
    id: string;
    name: string;
    kmph: number;
    mph: number;
  }[];
  measurementSystem: "metric" | "imperial";
  handleAddIconOpen: () => void;
  distance: number;
  handleDistanceIconIconOpen: () => void;
}

export default function SpeedSVG(props: SpeedProps) {
  const theme = useTheme();
  const color: string = theme.palette.mode === "light" ? "#3d5a80" : "#98c1d9";

  const SVG_WIDTH = 960;
  let overFive = props.speedData.length <= 5 ? 0 : props.speedData.length - 5;
  const SVG_HEIGTH = 400 + overFive * 50;
  const BAR_X_COORD = 20;
  const BAR_Y_COORD = 60;
  const BAR_HEIGHT = BAR_X_COORD * 2;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | d3.Selection<
    any,
    unknown,
    null,
    undefined
  >>(null);
  const [speedChartBarsSelection, setSpeedChartBarsSelection] =
    useState<null | d3.Selection<
      d3.BaseType | SVGRectElement,
      {
        id: string;
        name: string;
        kmph: number;
        mph: number;
      },
      d3.BaseType,
      unknown
    >>(null);

  useEffect(() => {
    if (!selection) {
      setSelection(d3.select(svgRef.current));
    } else {
      // theme.palette.mode === "dark"
      //   ? selection.attr("style", `outline: thin solid ${color};`)
      //   : selection.attr("style", `outline: thin solid rgba(0,0,0,0);`);

      const speedChart = selection.select(".SpeedChart");
      const SpeedChartBarsNameText = speedChart
        .select(".SpeedChartBarsNameText")
        .selectAll("text")
        .data(props.speedData)
        .join("text")
        .attr("font-size", 25)
        .attr("fill", color)
        .text((d) => {
          return d.name.slice(0, 70);
        })
        .attr("y", (_, i) => i * 50 + (29 + BAR_Y_COORD))
        .attr("x", BAR_X_COORD * 2);
      const SpeedChartBarsElapsedText = speedChart
        .select(".SpeedChartBarsElapsedText")
        .selectAll("text")
        .data(props.speedData)
        .join("text")
        .attr("font-size", 0)
        .attr("fill", color)
        .attr("id", (d) => {
          return "id" + d.id;
        })
        .text((d) => {
          if (elapsedRef.current) {
            elapsedRef.current = 0;
          }
          return stopWatch(calcualteTransitionDuration(d));
        })
        .attr("y", (_, i) => i * 50 + (29 + BAR_Y_COORD))
        .attr("x", SVG_WIDTH - 200);
      const speedChartBars = speedChart
        .selectAll("rect")
        .data(props.speedData)
        .join("rect")
        .attr("width", 0)
        .attr("height", BAR_HEIGHT)
        .attr("fill", (_) => {
          return getColor(theme.palette.mode);
        })
        .attr("stroke", color)
        .attr("stroke-width", 1)
        .attr("y", (_, i) => i * 50 + BAR_Y_COORD)
        .attr("x", BAR_X_COORD)
        .style("pointer-events", "visible")
        .on("click", (e, d) => {
          console.log("clicked");
        });

      const scale = d3
        .scaleLinear()
        .domain([0, props.distance])
        .range([0, SVG_WIDTH - BAR_X_COORD * 2]);
      const xAxis = d3.axisBottom(scale);
      speedChart
        .append("g")
        .style("font", "12px Montserrat")
        .attr("class", "xAxis")
        .attr("transform", "translate(20," + 20 + ")")
        .call(xAxis);

      setSpeedChartBarsSelection(speedChartBars);

      return () => {
        speedChart.selectAll(".xAxis").remove();
      };
    }
  }, [
    selection,
    props.speedData,
    theme,
    props.distance,
    props.measurementSystem,
  ]);

  const elapsedRef = useRef<number>(0);
  const elapsedRestartRef = useRef<number>(0);

  const [elapsedMax, setElapsedMax] = useState<number>(0);
  useEffect(() => {
    let tempElapsedMax = 0;
    for (const index in props.speedData) {
      tempElapsedMax = Math.max(
        tempElapsedMax,
        calcualteTransitionDuration(props.speedData[index])
      );
    }
    setElapsedMax(tempElapsedMax);
  }, [props.speedData, props.measurementSystem, props.distance]);

  const t = () => {
    const t = d3.timer((elapsed) => {
      elapsedRef.current = elapsed;
      if (elapsed > elapsedMax) {
        t.stop();
      } else {
        d3.select(".timer").text(stopWatch(elapsed));
      }
    });
    return t;
  };
  const [timer, setTimer] = useState<d3.Timer | null>(null);
  useEffect(() => {
    return () => {
      if (timer) {
        timer.stop();
      }
    };
  }, [timer]);

  function calcualteTransitionDuration(d: {
    id: string;
    name: string;
    kmph: number;
    mph: number;
  }) {
    let timeHours: null | number = null;
    if (props.measurementSystem === "metric") {
      timeHours = props.distance / d.kmph;
    } else {
      timeHours = props.distance / d.mph;
    }
    const timeMiliseconds = timeHours * 3600000;
    return timeMiliseconds - elapsedRef.current;
  }

  const pausedTimerRef = useRef<boolean>(false);
  const [inProgress, setInProgress] = useState<boolean>(false);
  function handleStartButton() {
    const speedChartBarsSelectionTransition = () => {
      if (speedChartBarsSelection) {
        speedChartBarsSelection
          .transition()
          .ease(d3.easeLinear)
          .duration((d) => {
            return calcualteTransitionDuration(d);
          })
          .attr("width", SVG_WIDTH - BAR_X_COORD * 2)
          .on("end", (d) => {
            if (selection) {
              selection
                .select(".SpeedChart")
                .select(".SpeedChartBarsElapsedText")
                .select(`#id${d.id}`)
                .attr("font-size", 25);
            }
          });
      }
    };
    setInProgress(true);
    if (timer) {
      if (pausedTimerRef && speedChartBarsSelection) {
        pausedTimerRef.current = false;
        speedChartBarsSelectionTransition();
        timer.restart((elapsed) => {
          elapsed = elapsed + elapsedRef.current;
          elapsedRestartRef.current = elapsed;
          if (elapsed > elapsedMax) {
            timer.stop();
          } else {
            d3.select(".timer").text(stopWatch(elapsed));
          }
        }, 150);
      }
    } else if (speedChartBarsSelection) {
      setTimer(t());
      speedChartBarsSelectionTransition();
    }
  }
  function handlePauseButton() {
    if (speedChartBarsSelection) speedChartBarsSelection.interrupt();
    setInProgress(false);
    if (timer) {
      pausedTimerRef.current = true;
      elapsedRef.current =
        elapsedRestartRef.current > 0
          ? elapsedRestartRef.current
          : elapsedRef.current;
      timer.stop();
    }
  }
  function handleResetButton() {
    setInProgress(false);
    if (speedChartBarsSelection) {
      speedChartBarsSelection
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .attr("width", 0);
    }
    if (timer) {
      timer.stop();
      pausedTimerRef.current = false;
      elapsedRef.current = 0;
      elapsedRestartRef.current = 0;
      setTimer(null);
      d3.select(".timer").text("00:00:00");
    }
  }
  useEffect(() => {
    handleResetButton();
  }, [props.measurementSystem, props.distance]);

  return (
    <Box my={1} display="flex" justifyContent="center" flexDirection={"column"}>
      <svg
        id="SpeedChart"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGTH}`}
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
      >
        <rect
          width="100%"
          height="100%"
          fill={
            theme.palette.mode === "light"
              ? "rgba(251, 254, 251, 0.6)"
              : "rgba(9, 10, 15, 0.8)"
          }
        />

        <g className="SpeedChart">
          <g className="SpeedChartAxis"></g>
          <g className="SpeedChartBarsNameText"></g>
          <g className="SpeedChartBarsElapsedText"></g>
        </g>
        <text
          fontSize={36}
          fill={color}
          x={SVG_WIDTH - 200}
          y={SVG_HEIGTH - 2 * 20}
          className="timer"
        ></text>
        <text
          fontSize={36}
          fill={color}
          x={BAR_X_COORD * 2}
          y={SVG_HEIGTH - 2 * 20}
          className="props.distance"
        >
          Distance: {props.distance}{" "}
          {props.measurementSystem === "metric" ? "km" : "mi"}
        </text>
        <line
          x1={BAR_X_COORD}
          y1={SVG_HEIGTH - BAR_X_COORD}
          x2={SVG_WIDTH}
          y2={SVG_HEIGTH - BAR_X_COORD}
          stroke={color}
        />
        <line
          x1={BAR_X_COORD}
          y1={SVG_HEIGTH - BAR_Y_COORD}
          x2={BAR_X_COORD}
          y2={SVG_HEIGTH - BAR_X_COORD}
          stroke={color}
        />
        <line
          x1={SVG_WIDTH}
          y1={1}
          x2={SVG_WIDTH}
          y2={SVG_HEIGTH - BAR_X_COORD}
          stroke={color}
        />
        {/* <line
          x1={SVG_WIDTH}
          y1={1}
          x2={SVG_WIDTH - BAR_X_COORD * 4}
          y2={1}
          stroke={color}
        /> */}
      </svg>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          p: 0.2,
        }}
      >
        <ButtonGroup size="medium" disableElevation variant="text">
          {!inProgress ? (
            <Button onClick={handleStartButton}>
              <PlayArrowIcon />
            </Button>
          ) : (
            <Button onClick={handlePauseButton}>
              <PauseIcon />
            </Button>
          )}

          <Button onClick={handleResetButton}>
            <RestartAltIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup
          sx={{ mr: 2 }}
          size="medium"
          disableElevation
          variant="text"
        >
          <Button onClick={props.handleAddIconOpen}>
            <AddIcon />
          </Button>
          <Button onClick={props.handleDistanceIconIconOpen}>
            <StraightenIcon />
          </Button>
          <Button>
            <SettingsIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

function getColor(themeMode: string) {
  if (themeMode === "light") {
    return (
      "hsla(" +
      360 * Math.random() +
      "," +
      (80 + 20 * Math.random()) +
      "%," +
      (40 + 60 * Math.random()) +
      "%, 0.1)"
    );
  } else {
    return (
      "hsla(" +
      200 +
      Math.random() * 50 +
      "," +
      70 +
      "%," +
      70 * Math.random() +
      "%, 0.2)"
    );
  }
}

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
