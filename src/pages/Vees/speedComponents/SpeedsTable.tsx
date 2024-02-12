import { useState } from "react";

import { useMeasurementSystem } from "../../../shared/contexts/MeasurementSystem";

import {
  useVeesSpeedData,
  veesSpeedDataInterface,
} from "../../../shared/contexts/VeesSpeedData";

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

interface rowProps {
  rowMainData: any;
  setSpeedData: any;
}
function Row({ setSpeedData, rowMainData }: rowProps) {
  const [, setVeesSpeedData] = useVeesSpeedData();

  const [measurementSystem] = useMeasurementSystem();

  const handleDeleteDataFromList = (id: string) => {
    setSpeedData((prev: any) => {
      return prev.filter((d: any) => d.id !== id);
    });

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
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {rowMainData.name}
        </TableCell>
        <TableCell align="right">
          {measurementSystem === "metric"
            ? Number.parseFloat(String(rowMainData.kmph)).toFixed(2)
            : Number.parseFloat(String(rowMainData.mph)).toFixed(2)}
        </TableCell>
        <TableCell align="right">
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDeleteDataFromList(rowMainData.id)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <h1>Placeholder</h1>
              <h1>Placeholder</h1>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

interface speedTableProps {
  speedData: any;
  setSpeedData: any;
}
export default function SpeedsTable({
  speedData,
  setSpeedData,
}: speedTableProps) {
  const theme = useTheme();

  const [measurementSystem] = useMeasurementSystem();

  return (
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
            {speedData.map((data: any) => (
              <Row
                key={data.id}
                setSpeedData={setSpeedData}
                rowMainData={data}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
