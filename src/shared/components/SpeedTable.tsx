import { useEffect, useState } from "react";

import { getSpeeds } from "../services/speeds/getData";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import AddIcon from "@mui/icons-material/Add";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import ReportIcon from "@mui/icons-material/Report";

function createData(score: number, name: string, speed: number) {
  return {
    score,
    name,
    speed,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}
function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <ThumbUpAltIcon />
        </TableCell>
        <TableCell align="center">{row.score}</TableCell>
        <TableCell align="left">
          <ThumbDownAltIcon />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.speed}</TableCell>
        <TableCell align="center">
          <StarOutlineIcon />
        </TableCell>
        <TableCell>
          <AddIcon />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="#tag5"
                    variant="outlined"
                    onClick={() => {
                      console.log("fdf");
                    }}
                  />
                  <Chip
                    label="#tag7"
                    variant="outlined"
                    onClick={() => {
                      console.log("chip");
                    }}
                  />
                </Stack>
                <div>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography>Public</Typography>
                    <LockOpenIcon color="success" />
                  </Stack>
                </div>
                <ButtonGroup
                  size="small"
                  variant="text"
                  aria-label="outlined primary button group"
                >
                  <Button>
                    <Typography>
                      &nbsp;&nbsp;Report
                      <IconButton
                        onClick={() => {
                          console.log("hello");
                        }}
                        color="info"
                      >
                        <ReportIcon color="warning" />
                      </IconButton>
                    </Typography>
                  </Button>
                  <Button>
                    <Typography>
                      &nbsp;&nbsp;Update
                      <IconButton
                        onClick={() => {
                          console.log("hello");
                        }}
                        color="info"
                      >
                        <EditIcon />
                      </IconButton>
                    </Typography>
                  </Button>
                  <Button>
                    <Typography>
                      &nbsp;&nbsp;Delete
                      <IconButton
                        onClick={() => {
                          console.log("hello");
                        }}
                        color="error"
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Typography>
                  </Button>
                </ButtonGroup>
              </div>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const rows = [
  createData(233, "Ice cream sandwich", 237),
  createData(34243, "Eclair", 262),
  createData(43, "Cupcake", 305),
  createData(34, "Gingerbread", 356),
  createData(
    1,
    "Light fdkfjdklsjfljdsl jsldfjslkdjfslkjdflsjd",
    23847289374891,
  ),
];

export default function SpeedTable() {
  const [page, setPage] = useState(0);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    getSpeeds({ userName: null }, true).then((response) => {
      console.log(response);
    });
  }, [page]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell width={"10%"} />
            <TableCell width={"5%"} align="right" />
            <TableCell align="center" width={"5%"}>
              Score
            </TableCell>
            <TableCell width={"5%"} align="left" />
            <TableCell align="left" width={"40%"}>
              Name
            </TableCell>
            <TableCell align="right" width={"10%"}>
              Speed
            </TableCell>
            <TableCell align="center" width={"5%"}></TableCell>
            <TableCell align="center" width={"5%"}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={6}
              count={343}
              rowsPerPage={10}
              page={page}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
