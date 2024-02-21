import { useState, useRef } from "react";

import kyClient from "../../../shared/services/ky";

import useLocalStorageState from "use-local-storage-state";
import { useMeasurementSystem } from "../../../shared/contexts/MeasurementSystem";
import { useIsAuthenticated } from "../../../shared/contexts/IsAuthenticated";
import {
  useVeesSpeedData,
  veesSpeedDataInterface,
} from "../../../shared/contexts/VeesSpeedData";
import { getSpeed } from "../../../shared/services/speeds/getData";
import { responseSpeedDataInterface } from "../../../shared/interfaces/speedInterfaces";
import { speedInterface } from "../../../shared/interfaces/speedInterfaces";
import { setApiErrorType } from "../../../shared/interfaces/apiInterfaces";

import ApiError from "../../../shared/components/ApiError";
import AddedBy from "../../../shared/components/speedsTableComponents/AddedBy";
import TagChip from "../../../shared/components/speedsTableComponents/TagChip";
import LinkToSpeed from "../../../shared/components/speedsTableComponents/LinkToSpeed";
import Feedback from "../../../shared/components/speedsTableComponents/Feedback";
import Bookmark from "../../../shared/components/speedsTableComponents/Bookmark";
import Report from "../../../shared/components/speedsTableComponents/Report";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import CasinoIcon from "@mui/icons-material/Casino";
import Button from "@mui/material/Button";

async function getRandomBasicSpeeds() {
  try {
    const response = await kyClient.backendApi.get("speeds/random-list/");
    const responseData: responseSpeedDataInterface = await response.json();
    return { status: response.status, data: responseData };
  } catch (error: any) {
    try {
      const response = await error.response;
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } catch (_error: any) {
      return { status: 500, data: {} };
    }
  }
}

interface rowProps {
  rowMainData: veesSpeedDataInterface;
  setApiError: setApiErrorType;
}
function Row({ rowMainData, setApiError }: rowProps) {
  const [isAuthenticated] = useIsAuthenticated();

  const [, setVeesSpeedData] = useVeesSpeedData();
  const [measurementSystem] = useMeasurementSystem();

  const [speed, setSpeed] = useState(rowMainData);
  const [externalSpeed, setExternalSpeed] = useState(speed.externalSpeed);

  const handleDeleteDataFromList = (id: string) => {
    setVeesSpeedData((prev: veesSpeedDataInterface[]) => {
      return prev.filter(
        (data: veesSpeedDataInterface) => data.localSpeed.id !== id,
      );
    });
  };

  // collapse
  const [open, setOpen] = useState(false);

  const handleDropDown = () => {
    // fetch data if Speed is basic (comes from search engine or
    // was added from bookmark tab for example)
    if (
      !open &&
      isAuthenticated &&
      speed.externalSpeedBasic &&
      speed.externalSpeed
    ) {
      getSpeed(speed.externalSpeed.id).then((result: any) => {
        if (result.status === 200) {
          setSpeed((prevState: veesSpeedDataInterface) => {
            prevState.externalSpeed = result.data;
            prevState.externalSpeedBasic = false;
            return prevState;
          });
          setExternalSpeed(result.data);
        } else if (result.status >= 500) {
          setApiError({ error: true, errorMessage: "Something went wrong." });
        } else if (result.status >= 400) {
          setApiError({
            error: true,
            errorMessage: result.data.detail
              ? result.data.detail
              : "Something went wrong, try again later.",
          });
        }
      });
    }
    setOpen(!open);
  };
  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": {
            border: 0,
          },
        }}
      >
        <TableCell sx={{ mr: 0, pr: 1, ml: 0, pl: 1 }}>
          {!rowMainData.local && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleDropDown}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ ml: 0, pl: 0 }}>
          {speed.localSpeed.name.length > 30 ? (
            <Tooltip
              enterTouchDelay={0}
              leaveTouchDelay={2000}
              title={
                <Typography fontSize={20}>{speed.localSpeed.name}</Typography>
              }
            >
              <Typography>{speed.localSpeed.name.slice(0, 30)}...</Typography>
            </Tooltip>
          ) : (
            speed.localSpeed.name.slice(0, 30)
          )}
        </TableCell>
        <TableCell align="right">
          {measurementSystem === "metric"
            ? Number.parseFloat(String(speed.localSpeed.kmph)).toFixed(2)
            : Number.parseFloat(String(speed.localSpeed.mph)).toFixed(2)}
        </TableCell>
        <TableCell align="right" sx={{ ml: 0, pl: 0 }}>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDeleteDataFromList(rowMainData.localSpeed.id)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                  {speed.externalSpeed?.tags.map((tag: string) => (
                    <TagChip key={tag} tag={tag} />
                  ))}
                </Stack>
                <LinkToSpeed speedId={speed.externalSpeed?.id} />
              </Box>

              <Typography variant="h6" gutterBottom component="div" mt={2}>
                {speed.externalSpeed?.description}
              </Typography>

              {speed.externalSpeed && (
                <AddedBy user={speed.externalSpeed.user} />
              )}
              {externalSpeed && (
                <>
                  <Divider sx={{ mt: 1, mb: 1 }} />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mb: 0 }}
                  >
                    {externalSpeed && (
                      <Feedback
                        rowType="regular"
                        speed={externalSpeed}
                        setSpeed={setExternalSpeed}
                        setApiError={setApiError}
                      />
                    )}
                    {externalSpeed && (
                      <Bookmark
                        speed={externalSpeed}
                        setSpeed={setExternalSpeed}
                        setApiError={setApiError}
                      />
                    )}
                  </Box>
                  {isAuthenticated && (
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      sx={{ mr: 1.5 }}
                    >
                      <Report speed={speed.externalSpeed} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function SpeedsTable() {
  const theme = useTheme();

  const [veesSpeedData, setVeesSpeedData] = useVeesSpeedData();
  const [measurementSystem] = useMeasurementSystem();

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

  // Random
  const randomBasicSpeeds = useRef<speedInterface[]>([]);
  let recursiveCallsCounter = 0;
  const addRandomSpeed = () => {
    if (recursiveCallsCounter >= 2) {
      setApiError({
        error: true,
        errorMessage:
          "Sorry, there are not enough Speeds to choose from. Try again in few days.",
      });
      return;
    }
    if (randomBasicSpeeds.current.length > 0) {
      const randomBasicSpeed: speedInterface | undefined =
        randomBasicSpeeds.current.pop();

      if (!randomBasicSpeed) {
        return;
      } else {
        let alreadySet = false;
        veesSpeedData.forEach((data: veesSpeedDataInterface) => {
          if (
            data.externalSpeed &&
            data.externalSpeed.id === randomBasicSpeed.id
          ) {
            alreadySet = true;
          }
        });
        if (alreadySet) {
          addRandomSpeed();
          return;
        }
      }

      const randomVeesSpeed: veesSpeedDataInterface = {
        local: false,
        localSpeed: {
          id: randomBasicSpeed.id,
          name: randomBasicSpeed.name,
          kmph: randomBasicSpeed.kmph,
          mph: randomBasicSpeed.kmph * 0.621371,
        },
        externalSpeed: randomBasicSpeed,
        externalSpeedBasic: true,
      };
      setVeesSpeedData((prevState: veesSpeedDataInterface[]) => {
        return [...prevState, randomVeesSpeed];
      });
    } else {
      // Api call
      getRandomBasicSpeeds().then((result) => {
        if (result.status === 200) {
          randomBasicSpeeds.current = result.data.results;
          setTimeout(
            () => {
              recursiveCallsCounter++;
              addRandomSpeed();
            },
            recursiveCallsCounter > 0 ? 700 : 0,
          );
        } else {
          setApiError({
            error: true,
            errorMessage: "Something went wrong, try again later.",
          });
        }
      });
    }
  };

  return (
    <Slide in={true} direction="up" mountOnEnter unmountOnExit>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection={"column"}
        my={2}
      >
        <ApiError apiError={apiError} setApiError={setApiError} />

        <TableContainer
          sx={{
            pt: 0.83,
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(251, 254, 251, 0.6)"
                : "rgba(9, 10, 15, 0.8)",
            borderBottom: `thin solid ${
              theme.palette.mode === "light" ? "#3d5a80" : "#98c1d9"
            }}`,
          }}
        >
          <Table
            aria-label="simple table"
            stickyHeader
            padding="normal"
            size="small"
          >
            <caption>
              <Box display="flex" justifyContent="center">
                <Button onClick={addRandomSpeed}>
                  <Stack direction="row" spacing={1}>
                    <Typography>Add Random Speed </Typography> <CasinoIcon />
                  </Stack>
                </Button>
              </Box>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">
                  {measurementSystem === "metric" ? "kmph" : "mph"}
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {veesSpeedData.map((data: veesSpeedDataInterface) => (
                <Row
                  key={data.localSpeed.id}
                  rowMainData={data}
                  setApiError={setApiError}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Slide>
  );
}
