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
      const speedChartBarsName = speedChart
        .selectAll("text")
        .data(props.speedData)
        .join("text")
        .attr("font-size", 25)
        .text((d) => {
          return d.name.slice(0, 60);
        })
        .attr("y", (_, i) => i * 50 + 49)
        .attr("x", 30);
      const speedChartBars = speedChart
        .selectAll("rect")
        .data(props.speedData)
        .join("rect")
        .attr("width", 0)
        .attr("height", 40)
        .attr("fill", (_) => {
          return "#" + Math.floor(Math.random() * 16777215).toString(16) + "40";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("y", (_, i) => i * 50 + 20)
        .attr("x", 20)
        .style("pointer-events", "visible")
        .on("click", (e, d) => {
          console.log("clicked on bar");
        });
      setBarsSelection(speedChartBars);
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
      if (pausedTimerRef && barsSelection) {
        pausedTimerRef.current = false;

        barsSelection
          .transition()
          .ease(d3.easeLinear)
          .duration((d) => {
            const transitionDuration = calcualteTransitionDuration(d);
            return transitionDuration + transitionDuration * 0.0186;
          })
          .attr("width", 960)
          .on("end", (d) => {
            console.log("aaaaaaa", d.name);
          });

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
    } else if (barsSelection) {
      setTimer(t());
      barsSelection
        .transition()
        .ease(d3.easeLinear)
        .duration((d) => {
          const transitionDuration = calcualteTransitionDuration(d);
          console.log(transitionDuration);
          return transitionDuration + transitionDuration * 0.0186;
        })
        .attr("width", 960)
        .on("end", (d) => {
          // console.log(d);
        });
    }
  }
  function handlePauseButton() {
    if (barsSelection) barsSelection.interrupt();
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
    if (barsSelection) {
      barsSelection
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
    <Box my={0} display="flex" justifyContent="center" flexDirection={"column"}>
      <svg
        id="speed-chart"
        viewBox={`0 0 ${960} ${400}`}
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
      >
        <g className="SpeedChart"></g>
        <text fontSize={50} x="700" y="370" className="timer"></text>
        {/* <line x1="42" y1="30" x2="42" y2="380" stroke="black" /> */}
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
