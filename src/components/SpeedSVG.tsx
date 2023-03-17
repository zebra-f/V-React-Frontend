import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as d3 from "d3";
import ButtonGroup from "@mui/material/ButtonGroup";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SettingsIcon from "@mui/icons-material/Settings";

interface SpeedProps {
  speedData: {
    id: string;
    name: string;
    kmph: number;
    mph: number;
  }[];
  measurementSystem: "metric" | "imperial";
}

export default function SpeedSVG(props: SpeedProps) {
  const SVG_WIDTH = 960;
  const SVG_HEIGTH = 400;
  const BAR_X_COORD = 20;
  const BAR_Y_COORD = 20;
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
      selection.attr("style", "outline: thin solid #000000;");
      const speedChart = selection.select(".SpeedChart");
      const SpeedChartBarsNameText = speedChart
        .select(".SpeedChartBarsNameText")
        .selectAll("text")
        .data(props.speedData)
        .join("text")
        .attr("font-size", 25)
        .text((d) => {
          return d.name.slice(0, 60);
        })
        .attr("y", (_, i) => i * 50 + 49)
        .attr("x", 30);
      const SpeedChartBarsElapsedText = speedChart
        .select(".SpeedChartBarsElapsedText")
        .selectAll("text")
        .data(props.speedData)
        .join("text")
        .attr("font-size", 0)
        .attr("id", (d) => {
          return "id" + d.id;
        })
        .text((d) => {
          if (elapsedRef.current) {
            elapsedRef.current = 0;
          }
          return stopWatch(calcualteTransitionDuration(d));
        })
        .attr("y", (_, i) => i * 50 + 49)
        .attr("x", SVG_WIDTH - SVG_HEIGTH / 2);
      const speedChartBars = speedChart
        .selectAll("rect")
        .data(props.speedData)
        .join("rect")
        .attr("width", 0)
        .attr("height", BAR_HEIGHT)
        .attr("fill", (_) => {
          return "#" + Math.floor(Math.random() * 16777215).toString(16) + "40";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("y", (_, i) => i * (SVG_HEIGTH / 8) + BAR_Y_COORD)
        .attr("x", BAR_X_COORD)
        .style("pointer-events", "visible")
        .on("click", (e, d) => {
          console.log("clicked on bar");
        });

      setSpeedChartBarsSelection(speedChartBars);
    }
  }, [selection, props.speedData]);

  const [distance, setDistance] = useState<number>(1);
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
  }, [props.speedData, props.measurementSystem]);

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
      timeHours = distance / d.kmph;
    } else {
      timeHours = distance / d.mph;
    }
    const timeMiliseconds = timeHours * 3600000;
    return timeMiliseconds - elapsedRef.current;
  }

  const pausedTimerRef = useRef<boolean>(false);
  const [inProgress, setInProgress] = useState<boolean>(false);
  function handleStartButton() {
    setInProgress(true);
    if (timer) {
      if (pausedTimerRef && speedChartBarsSelection) {
        pausedTimerRef.current = false;

        speedChartBarsSelection
          .transition()
          .ease(d3.easeLinear)
          .duration((d) => {
            return calcualteTransitionDuration(d);
          })
          .attr("width", SVG_WIDTH - 20)
          .on("end", (d) => {});

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
      speedChartBarsSelection
        .transition()
        .ease(d3.easeLinear)
        .duration((d) => {
          return calcualteTransitionDuration(d);
        })
        .attr("width", SVG_WIDTH - 20)
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

  return (
    <Box my={1} display="flex" justifyContent="center" flexDirection={"column"}>
      <svg
        id="SpeedChart"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGTH}`}
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
      >
        <g className="SpeedChart">
          <g className="SpeedChartBarsNameText"></g>
          <g className="SpeedChartBarsElapsedText"></g>
        </g>
        <text
          fontSize={40}
          x={SVG_WIDTH - SVG_HEIGTH / 2}
          y="370"
          className="timer"
        ></text>
        {/* <line x1="42" y1="30" x2="42" y2="380" stroke="black" /> */}
      </svg>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          p: 0,
          m: 0.5,
        }}
      >
        <ButtonGroup size="small" disableElevation variant="text">
          {!inProgress ? (
            <Button onClick={handleStartButton}>
              <PlayArrowIcon />
            </Button>
          ) : (
            <Button size="small" onClick={handlePauseButton}>
              <PauseIcon />
            </Button>
          )}

          <Button size="small" onClick={handleResetButton}>
            <RestartAltIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small" disableElevation variant="text">
          <Button>
            <SettingsIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
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
