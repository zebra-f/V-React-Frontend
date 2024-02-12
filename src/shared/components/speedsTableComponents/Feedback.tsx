import { makeSpeedFeedback } from "../../../actions/speed/feedback";

import { speedInterface } from "../../interfaces/speedInterfaces";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import Button from "@mui/material/Button";

interface feedbackPropsInterface {
  rowType: "regular" | "feedback" | "bookmark";
  speed: speedInterface;
  setSpeed: null | React.Dispatch<React.SetStateAction<speedInterface>>;
  setApiError: null | any;
}
export default function Feedback({
  rowType,
  speed,
  setSpeed,
  setApiError,
}: feedbackPropsInterface) {
  const handleFeedbackRequestResult = (result: any) => {
    if (result.status === 201 || result.status === 200) {
      const userSpeedFeedback = {
        feedback_id: result.data.id,
        feedback_vote: result.data.vote,
      };
      if (setSpeed) {
        setSpeed((prevState) => {
          return {
            ...prevState,
            user_speed_feedback: userSpeedFeedback,
            score: result.data.speed.score,
          };
        });
      }
      if (setApiError) {
        setApiError({
          error: false,
          errorMessage: "",
        });
      }
    } else {
      if (setApiError) {
        setApiError({
          error: true,
          errorMessage: "Something went wrong. Try again later.",
        });
      }
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

  return (
    <Box
      display="flex"
      justifyContent={rowType === "bookmark" ? "center" : "space-between"}
    >
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

      <Typography sx={{ pt: 0.75 }}>{speed.score}</Typography>

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
    </Box>
  );
}
