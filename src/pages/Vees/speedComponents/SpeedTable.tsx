import { useMeasurementSystem } from "../../../shared/contexts/MeasurementSystem";

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

interface speedTableProps {
  speedData: any;
  setSpeedData: any;
}
export default function SpeedTable({
  speedData,
  setSpeedData,
}: speedTableProps) {
  const theme = useTheme();

  const [measurementSystem] = useMeasurementSystem();

  const handleDeleteDataFromList = (id: string) => {
    setSpeedData((prev: any) => {
      return prev.filter((d: any) => d.id !== id);
    });
  };

  return (
    <Box display="flex" justifyContent="center" my={2}>
      <TableContainer
        sx={{
          pt: 0.84,
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
              <TableCell>Name</TableCell>
              <TableCell align="right">
                {measurementSystem === "metric" ? "kmph" : "mph"}
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {speedData.map((d: any) => (
              <TableRow
                key={d.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {d.name}
                </TableCell>
                <TableCell align="right">
                  {measurementSystem === "metric"
                    ? Number.parseFloat(String(d.kmph)).toFixed(2)
                    : Number.parseFloat(String(d.mph)).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteDataFromList(d.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
