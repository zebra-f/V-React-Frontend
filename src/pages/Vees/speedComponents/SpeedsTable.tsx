import { useState } from "react";

import { useMeasurementSystem } from "../../../shared/contexts/MeasurementSystem";

import {
  useVeesSpeedData,
  veesSpeedDataInterface,
} from "../../../shared/contexts/VeesSpeedData";

import AddedBy from "../../../shared/components/speedsTableComponents/AddedBy";
import TagChip from "../../../shared/components/speedsTableComponents/TagChip";

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

interface rowProps {
  rowMainData: veesSpeedDataInterface;
}
function Row({ rowMainData }: rowProps) {
  const [, setVeesSpeedData] = useVeesSpeedData();
  const [measurementSystem] = useMeasurementSystem();

  const [speed, setSpeed] = useState(rowMainData);

  const handleDeleteDataFromList = (id: string) => {
    setVeesSpeedData((prev: veesSpeedDataInterface[]) => {
      return prev.filter(
        (data: veesSpeedDataInterface) => data.localSpeed.id !== id,
      );
    });
  };

  // collapse
  const [open, setOpen] = useState(false);

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
              onClick={() => setOpen(!open)}
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
            speed.localSpeed.name.slice(0, 30) + "..."
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
              <Stack direction="row" spacing={1}>
                {speed.externalSpeed?.tags.map((tag: string) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </Stack>

              <Typography variant="h6" gutterBottom component="div" mt={2}>
                {speed.externalSpeed?.description}
              </Typography>

              {speed.externalSpeed && (
                <AddedBy user={speed.externalSpeed.user} />
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

  const [veesSpeedData] = useVeesSpeedData();
  const [measurementSystem] = useMeasurementSystem();

  return (
    <Slide in={true} direction="up" mountOnEnter unmountOnExit>
      <Box display="flex" justifyContent="center" my={2}>
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
                <Row key={data.localSpeed.id} rowMainData={data} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Slide>
  );
}
