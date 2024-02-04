import { useState, SetStateAction, Dispatch } from "react";
import { useNavigate } from "react-router-dom";

import {
  speedInterface,
  speedQueryParams,
} from "../interfaces/speedInterfaces";

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
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import Fade from "@mui/material/Fade";

function Row(props: {
  row: speedInterface;
  measurementSystem: "metric" | "imperial";
  isEditable: boolean;
}) {
  const navigate = useNavigate();

  const { row, measurementSystem, isEditable } = props;
  const [open, setOpen] = useState(false);

  const [bookmark, setBookmark] = useState<boolean>(
    row.user_speed_bookmark ? true : false,
  );
  const [vote, setVote] = useState<number>(
    row.user_speed_feedback ? row.user_speed_feedback.feedback_vote : 0,
  );

  const handleLinkToUserProfile = (userName: string) => {
    navigate(`/profile/${userName}/speeds`);
  };

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
        <TableCell align="center">
          <Typography>{row.score}</Typography>
        </TableCell>
        <TableCell align="left">
          <ThumbDownAltIcon color={vote === -1 ? "info" : "primary"} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography>{row.name}</Typography>
        </TableCell>
        <TableCell align="right">
          <Tooltip
            title={
              <Typography fontSize={20}>
                {row.estimated
                  ? row.speed_type + " (estimated)"
                  : row.speed_type}
              </Typography>
            }
          >
            <Typography>
              {measurementSystem == "metric"
                ? `${row.kmph} kmph`
                : `${(row.kmph * 0.621371).toFixed(2)} mph`}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <StarOutlineIcon color={bookmark ? "warning" : "primary"} />
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
                {isEditable && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography>
                      {row.is_public ? "Public" : "Private"}
                    </Typography>
                    <LockOpenIcon color={row.is_public ? "success" : "error"} />
                  </Stack>
                )}
                <ButtonGroup
                  size="small"
                  variant="text"
                  aria-label="outlined primary button group"
                >
                  {!isEditable && (
                    <Button>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>Report</Typography>
                        <ReportIcon color="warning" />
                      </Stack>
                    </Button>
                  )}
                  {isEditable && (
                    <Button>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>&nbsp;Update</Typography>
                        <EditIcon color="info" />
                      </Stack>
                    </Button>
                  )}
                  {isEditable && (
                    <Button>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>&nbsp;Delete</Typography>
                        <DeleteForeverIcon color="error" />
                      </Stack>
                    </Button>
                  )}
                </ButtonGroup>
              </div>
              <Typography variant="h6" gutterBottom component="div" mt={2}>
                {row.description}
              </Typography>
              {!isEditable && (
                <Typography color={"#bb54e7"} variant="subtitle1" mt={2}>
                  Added by:&nbsp;
                  <Link
                    href="#"
                    onClick={() => {
                      handleLinkToUserProfile(row.user);
                    }}
                    underline="none"
                  >
                    {row.user}
                  </Link>
                </Typography>
              )}
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

interface speedsTableProps {
  queryParams: speedQueryParams;
  setQueryParams: Dispatch<SetStateAction<speedQueryParams>>;
  results: Array<speedInterface>; // list of Speeds
  count: number; // count of all Speeds available via API
  measurementSystem: "metric" | "imperial";
  isEditable: boolean; // a user views his own profile
}
export default function SpeedsTable({
  queryParams,
  setQueryParams,
  results,
  count,
  measurementSystem,
  isEditable,
}: speedsTableProps) {
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setQueryParams((prevQueryParams: speedQueryParams) => {
      return {
        ...prevQueryParams,
        // in MUI pagination starts at page 0
        page: newPage + 1,
      };
    });
  };

  return (
    <Fade in={true}>
      <TableContainer component={Paper} sx={{ mt: 2, mb: 10 }}>
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
              <TableCell align="right" width={"20%"}>
                Speed
              </TableCell>
              <TableCell align="center" width={"8%"}></TableCell>
              <TableCell align="center" width={"12%"}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results ? (
              results.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  measurementSystem={measurementSystem}
                  isEditable={isEditable}
                />
              ))
            ) : (
              <></>
            )}
          </TableBody>
          <TableFooter>
            <TableRow sx={{ "& td": { border: 0 } }}>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={6}
                count={count}
                rowsPerPage={10}
                page={queryParams.page - 1}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Fade>
  );
}
