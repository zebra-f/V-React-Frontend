import { useState, useEffect, useRef, SetStateAction, Dispatch } from "react";
import { useNavigate } from "react-router-dom";

import { useMeasurementSystem } from "../contexts/MeasurementSystem";

import SpeedForm from "./SpeedForm";
import ReportForm from "./ReportForm";

import {
  speedInterface,
  speedQueryParams,
} from "../interfaces/speedInterfaces";
import { makeSpeedFeedback } from "../../actions/speed/feedback";
import {
  createSpeedBookmark,
  deleteSpeedBookmark,
} from "../../actions/speed/bookmark";
import { deleteSpeed } from "../services/speeds/deleteData";

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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

function Row(props: {
  key: string & { isUUID: true };
  rowMainData: speedInterface;
  isEditable: boolean;
  rowType: "regular" | "feedback" | "bookmark";
  setResults: React.Dispatch<React.SetStateAction<speedInterface[]>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setApiError: React.Dispatch<
    React.SetStateAction<{ error: boolean; errorMessage: string }>
  >;
}) {
  const navigate = useNavigate();

  const [measurementSystem] = useMeasurementSystem();

  const {
    rowMainData,
    isEditable,
    rowType,
    setResults,
    setCount,
    setApiError,
  } = props;
  const [speed, setSpeed] = useState<speedInterface>(rowMainData);

  const [open, setOpen] = useState(false);

  const handleLinkToUserProfile = (userName: string) => {
    navigate(`/profile/${userName}/speeds`);
  };

  const handleFeedbackRequestResult = (result: any) => {
    if (result.status === 201 || result.status === 200) {
      const userSpeedFeedback = {
        feedback_id: result.data.id,
        feedback_vote: result.data.vote,
      };
      setSpeed((prevState) => {
        return {
          ...prevState,
          user_speed_feedback: userSpeedFeedback,
          score: result.data.speed.score,
        };
      });
      setApiError({
        error: false,
        errorMessage: "",
      });
    } else {
      setApiError({
        error: true,
        errorMessage: "Something went wrong. Try again later.",
      });
    }
  };
  const handleUpvote = () => {
    // create
    if (!speed.user_speed_feedback) {
      makeSpeedFeedback(null, speed.id, 1, true).then((result) => {
        handleFeedbackRequestResult(result);
      });
      // update
    } else {
      if (speed.user_speed_feedback.feedback_vote === 1) {
        makeSpeedFeedback(
          speed.user_speed_feedback.feedback_id,
          null,
          0,
          false,
        ).then((result) => {
          handleFeedbackRequestResult(result);
        });
      } else {
        makeSpeedFeedback(
          speed.user_speed_feedback.feedback_id,
          null,
          1,
          false,
        ).then((result) => {
          handleFeedbackRequestResult(result);
        });
      }
    }
  };
  const handleDownvote = () => {
    // create
    if (!speed.user_speed_feedback) {
      makeSpeedFeedback(null, speed.id, -1, true).then((result) => {
        handleFeedbackRequestResult(result);
      });
      // update
    } else {
      if (speed.user_speed_feedback.feedback_vote === -1) {
        makeSpeedFeedback(
          speed.user_speed_feedback.feedback_id,
          null,
          0,
          false,
        ).then((result) => {
          handleFeedbackRequestResult(result);
        });
      } else {
        makeSpeedFeedback(
          speed.user_speed_feedback.feedback_id,
          null,
          -1,
          false,
        ).then((result) => {
          handleFeedbackRequestResult(result);
        });
      }
    }
  };

  const handleCreateBookmark = () => {
    if (!speed.user_speed_bookmark) {
      createSpeedBookmark(speed.id, null).then((result) => {
        if (result.status === 201) {
          const userSpeedBookmark = {
            bookmark_id: result.data.id,
            bookmark_category: result.data.category,
          };
          setSpeed((prevState: any) => {
            return {
              ...prevState,
              user_speed_bookmark: userSpeedBookmark,
            };
          });
          setApiError({
            error: false,
            errorMessage: "",
          });
        } else {
          setApiError({
            error: true,
            errorMessage: "Something went wrong. Try again later",
          });
        }
      });
    }
  };
  const handleDeleteBookmark = () => {
    if (speed.user_speed_bookmark) {
      deleteSpeedBookmark(speed.user_speed_bookmark.bookmark_id).then(
        (result) => {
          if (result.status === 204) {
            setSpeed((prevState) => {
              return {
                ...prevState,
                user_speed_bookmark: null,
              };
            });
            setApiError({
              error: false,
              errorMessage: "",
            });
          } else {
            setApiError({
              error: true,
              errorMessage: "Something went wrong. Try again later",
            });
          }
        },
      );
    }
  };

  const [openedConfirmDelete, setOpenedConfirmDelete] = useState(false);
  const handleCancelDeleteSpeed = () => {
    setOpenedConfirmDelete(false);
  };
  const handleConfirmDeleteSpeed = () => {
    deleteSpeed({ id: speed.id }).then((result) => {
      if (result.status === 204) {
        setResults((prevState) => {
          return prevState.filter((speed_) => speed_.id !== speed.id);
        });
        setCount((prevCount: number) => prevCount - 1);
        setApiError({
          error: false,
          errorMessage: "",
        });
      } else {
        setApiError({
          error: true,
          errorMessage: "Something went wrong. Try again later.",
        });
      }
    });
  };
  const handleDeleteSpeedButton = () => {
    setOpenedConfirmDelete(true);
  };

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const handleEditButton = () => {
    setFormOpen(true);
  };
  const [speedFormResponseData, setSpeedFormResponseData] =
    useState<speedInterface | null>(null);

  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (speedFormResponseData !== null) {
      setSpeed(speedFormResponseData);
    }
  }, [speedFormResponseData]);

  const [reportFormOpen, setReportFormOpen] = useState<boolean>(false);
  const handleReportButton = () => {
    setReportFormOpen(true);
  };

  return (
    <>
      {formOpen && (
        <SpeedForm
          formOpen={formOpen}
          setFormOpen={setFormOpen}
          speedData={speed}
          setSpeedFormResponseData={setSpeedFormResponseData}
        />
      )}

      {reportFormOpen && (
        <ReportForm
          formOpen={reportFormOpen}
          setFormOpen={setReportFormOpen}
          speedData={speed}
        />
      )}

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
          {!(rowType === "bookmark") && (
            <Button onClick={handleUpvote}>
              <ThumbUpAltIcon
                color={
                  speed.user_speed_feedback &&
                  speed.user_speed_feedback.feedback_vote === 1
                    ? "warning"
                    : "primary"
                }
              />
            </Button>
          )}
        </TableCell>
        <TableCell align="center">
          <Typography>{speed.score}</Typography>
        </TableCell>
        <TableCell align="left">
          {!(rowType === "bookmark") && (
            <Button onClick={handleDownvote}>
              <ThumbDownAltIcon
                color={
                  speed.user_speed_feedback &&
                  speed.user_speed_feedback.feedback_vote === -1
                    ? "warning"
                    : "primary"
                }
              />
            </Button>
          )}
        </TableCell>

        <TableCell component="th" scope="row">
          {speed.name.length <= 64 ? (
            <Typography>{speed.name}</Typography>
          ) : (
            <Tooltip
              enterTouchDelay={0}
              leaveTouchDelay={2000}
              title={<Typography fontSize={20}>{speed.name}</Typography>}
            >
              <Typography>{speed.name.slice(0, 64)}...</Typography>
            </Tooltip>
          )}
        </TableCell>

        <TableCell align="right">
          <Tooltip
            title={
              <Typography fontSize={20}>
                {speed.estimated
                  ? speed.speed_type + " (estimated)"
                  : speed.speed_type}
              </Typography>
            }
          >
            <Typography>
              {measurementSystem == "metric"
                ? `${speed.kmph} kmph`
                : `${(speed.kmph * 0.621371).toFixed(2)} mph`}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell align="center">
          {(rowType == "regular" || rowType == "bookmark") && (
            <Button
              onClick={() => {
                if (!speed.user_speed_bookmark) {
                  handleCreateBookmark();
                } else {
                  handleDeleteBookmark();
                }
              }}
            >
              <StarOutlineIcon
                color={speed.user_speed_bookmark ? "warning" : "primary"}
              />
            </Button>
          )}
        </TableCell>
        <TableCell>
          <AddIcon />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1}>
                  {speed.tags.map((tag: string) => (
                    <Chip key={tag} label={tag} variant="outlined" />
                  ))}
                </Stack>
                {isEditable && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography>
                      {speed.is_public ? "Public" : "Private"}
                    </Typography>
                    <LockOpenIcon
                      color={speed.is_public ? "success" : "error"}
                    />
                  </Stack>
                )}
                <ButtonGroup
                  size="small"
                  variant="text"
                  aria-label="outlined primary button group"
                >
                  {!isEditable && (
                    <Button onClick={handleReportButton}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>Report</Typography>
                        <ReportIcon color="error" />
                      </Stack>
                    </Button>
                  )}
                  {isEditable && (
                    <Button onClick={handleEditButton}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>&nbsp;Edit</Typography>
                        <EditIcon color="info" />
                      </Stack>
                    </Button>
                  )}

                  {isEditable && !openedConfirmDelete && (
                    <Button onClick={handleDeleteSpeedButton}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>&nbsp;Delete</Typography>
                        <DeleteForeverIcon color="error" />
                      </Stack>
                    </Button>
                  )}
                  {isEditable && openedConfirmDelete && (
                    <Button onClick={handleConfirmDeleteSpeed}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>&nbsp;Confirm</Typography>
                        <CheckIcon color="success" />
                      </Stack>
                    </Button>
                  )}
                  {isEditable && openedConfirmDelete && (
                    <Button onClick={handleCancelDeleteSpeed}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>&nbsp;Cancel</Typography>
                        <CloseIcon color="error" />
                      </Stack>
                    </Button>
                  )}
                </ButtonGroup>
              </Box>
              <Typography variant="h6" gutterBottom component="div" mt={2}>
                {speed.description}
              </Typography>
              {!isEditable && (
                <Typography color={"#bb54e7"} variant="subtitle1" mt={2}>
                  Added by:&nbsp;
                  <Link
                    href="#"
                    onClick={() => {
                      handleLinkToUserProfile(speed.user);
                    }}
                    underline="none"
                  >
                    {speed.user}
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
  setResults: React.Dispatch<React.SetStateAction<speedInterface[]>>;
  count: number; // count of all Speeds available via API
  setCount: React.Dispatch<React.SetStateAction<number>>;
  isEditable: boolean; // a user views his own profile
  rowType: "regular" | "feedback" | "bookmark";
}
export default function SpeedsTable({
  queryParams,
  setQueryParams,
  results,
  setResults,
  count,
  setCount,
  isEditable,
  rowType,
}: speedsTableProps) {
  const theme = useTheme();

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

  const [dense, setDense] = useState(true);
  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const [apiError, setApiError] = useState({
    error: false,
    errorMessage: "",
  });

  return (
    <Fade in={true}>
      <Paper
        sx={{
          mt: 2,
          mb: 10,

          pt: 0.84,
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(251, 254, 251, 0.6)"
              : "rgba(9, 10, 15, 0.8)",
        }}
      >
        {apiError.error && (
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setApiError({ error: false, errorMessage: "" });
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ width: "100%", mt: 3 }}
            severity="error"
          >
            {apiError.errorMessage}
          </Alert>
        )}

        <Box m={2}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
        <TableContainer
          sx={{
            mt: 2,
          }}
        >
          <Table
            aria-label="collapsible table"
            size={dense ? "small" : "medium"}
          >
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
                    rowMainData={row}
                    isEditable={isEditable}
                    rowType={rowType}
                    setResults={setResults}
                    setCount={setCount}
                    setApiError={setApiError}
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
      </Paper>
    </Fade>
  );
}
