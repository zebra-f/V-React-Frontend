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

function Row(props: { row: speedInterface }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const [vote, setVote] = useState<any>(
    row.user_speed_feedback ? row.user_speed_feedback.feedback_vote : 0,
  );

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
          <ThumbUpAltIcon color={vote === 1 ? "info" : "primary"} />
        </TableCell>
        <TableCell align="center">{row.score}</TableCell>
        <TableCell align="left">
          <ThumbDownAltIcon color={vote === -1 ? "info" : "primary"} />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.kmph}</TableCell>
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
                  {row.tags.map((tag: string) => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      onClick={() => {
                        console.log("fdf");
                      }}
                    />
                  ))}
                </Stack>
                <div>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography>
                      {row.is_public ? "Public" : "Private"}
                    </Typography>
                    <LockOpenIcon color={row.is_public ? "success" : "error"} />
                  </Stack>
                </div>
                <ButtonGroup
                  size="small"
                  variant="text"
                  aria-label="outlined primary button group"
                >
                  <Button>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography>&nbsp;&nbsp;Report</Typography>
                      <ReportIcon color="warning" />
                    </Stack>
                  </Button>
                  <Button>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography>&nbsp;&nbsp;Update</Typography>
                      <EditIcon color="info" />
                    </Stack>
                  </Button>
                  <Button>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography>&nbsp;&nbsp;Delete</Typography>
                      <DeleteForeverIcon color="error" />
                    </Stack>
                  </Button>
                </ButtonGroup>
              </div>
              <Typography variant="h6" gutterBottom component="div" mt={2}>
                {row.description}
              </Typography>
              <Typography variant="subtitle1" mt={2}>
                Created by: {row.user}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
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

interface responseSpeedDataState {
  count: number;
  next: string;
  previous: string;
  results: Array<Object>;
}
interface userSpeedFeedback {
  feedback_id: number;
  feedback_vote: number;
}
interface speedInterface {
  description: string;
  estimated: boolean;
  id: string & { isUUID: true };
  is_public: boolean;
  kmph: number;
  name: string;
  score: number;
  speed_type: string;
  tags: Array<string>;
  url: string;
  user: string;
  user_speed_bookmark: null | Object;
  user_speed_feedback: null | userSpeedFeedback;
}

export default function SpeedTable() {
  const [results, setResults] = useState<Array<speedInterface>>();
  const [responseSpeedData, setResponseSpeedData] =
    useState<responseSpeedDataState>({
      count: 0,
      next: "",
      previous: "",
      results: [],
    });
  const [page, setPage] = useState(0);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    getSpeeds({ userName: null }, true).then((response) => {
      if (response.status == 200) {
        setResponseSpeedData(response.data);

        let resultsTemp: any = [];
        response.data.results.forEach((result: any) => {
          // anon user
          if (result.user_speed_bookmark === undefined) {
            result.user_speed_bookmark = null;
          }
          if (result.user_speed_feedback === undefined) {
            result.user_speed_bookmark = null;
          }
          resultsTemp.push(result);
        });
        setResults(resultsTemp);
      } else {
        console.log("not ok");
      }
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
            <TableCell align="center" width={"4%"}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results ? (
            results.map((result) => <Row key={result.id} row={result} />)
          ) : (
            <></>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={6}
              count={responseSpeedData.count}
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
