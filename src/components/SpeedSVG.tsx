import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as d3 from "d3";
import ButtonGroup from "@mui/material/ButtonGroup";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SettingsIcon from "@mui/icons-material/Settings";

export default function SpeedSVG(props: any) {
  const speedData: {
    id: string;
    name: string;
    speed: number;
  }[] = props.speedData;
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

  const elapsedRef = useRef<number>(0);
  const elapsedRestartRef = useRef<number>(0);
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

  const t = () => {
    const t = d3.timer((elapsed) => {
      elapsedRef.current = elapsed;
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
      const speedChartBarsName = speedChart
        .selectAll("text")
        .data(speedData)
        .join("text")
        .attr("font-size", 25)
        .text((d) => {
          return d.name.slice(0, 60);
        })
        .attr("y", (_, i) => i * 50 + 49)
        .attr("x", 30);
      const speedChartBars = speedChart
        .selectAll("rect")
        .data(speedData)
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
  }, [selection, speedData]);

  const pausedTimerRef = useRef<boolean>(false);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const inProgressRef = useRef<boolean>(false);
  function handleStartButton() {
    inProgressRef.current = true;
    setInProgress(true);
    if (timer) {
      if (pausedTimerRef) {
        pausedTimerRef.current = false;

        timer.restart((elapsed) => {
          elapsed = elapsed + elapsedRef.current;
          elapsedRestartRef.current = elapsed;
          if (elapsed > 2000000) {
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
          // km
          const distance = 1;
          const timeHours = distance / d.speed;
          const timeMiliseconds = timeHours * 3600000;
          return timeMiliseconds;
        })
        .attr("width", 960)
        .on("end", () => {
          // d3.select(this: any).attrs({ fill: "yellow" });
        });
    }
  }
  function handlePauseButton() {
    inProgressRef.current = false;
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
    inProgressRef.current = false;
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
        <ButtonGroup size="small" disableElevation>
          {!inProgressRef.current ? (
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
        <ButtonGroup size="small" disableElevation>
          <Button>
            <SettingsIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}
