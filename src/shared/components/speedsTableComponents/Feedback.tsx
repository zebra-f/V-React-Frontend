import { useState } from "react";

import { useIsAuthenticated } from "../../contexts/IsAuthenticated";
import {
  useVeesSpeedData,
  veesSpeedDataInterface,
} from "../../contexts/VeesSpeedData";

import { makeSpeedFeedback } from "../../../actions/speed/feedback";

import { speedInterface } from "../../interfaces/speedInterfaces";

import BackdropNavigateAnon from "./BackdropNavigateAnon";

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
  const [isAuthenticated] = useIsAuthenticated();
  const [, setVeesSpeedData] = useVeesSpeedData();

  const [backdropNavigateAnonOpen, setBackdropNavigateAnonOpen] =
    useState(false);

  const handleFeedbackRequestResult = (result: any) => {
    if (result.status === 201 || result.status === 200) {
      const userSpeedFeedback = {
        feedback_id: result.data.id,
        feedback_vote: result.data.vote,
      };
      setVeesSpeedData((prevState: Array<veesSpeedDataInterface>) => {
        prevState.forEach((speed_: veesSpeedDataInterface) => {
          if (
            speed_.externalSpeed &&
            speed_.localSpeed.id === result.data.speed.id
          ) {
            speed_.externalSpeed.score = result.data.speed.score;
            speed_.externalSpeed.user_speed_feedback = userSpeedFeedback;
          }
        });
        return prevState;
      });
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
    if (!isAuthenticated) {
      setBackdropNavigateAnonOpen(true);
      return;
    }

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
    if (!isAuthenticated) {
      setBackdropNavigateAnonOpen(true);
      return;
    }

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
      <BackdropNavigateAnon
        backdropNavigateAnonOpen={backdropNavigateAnonOpen}
        setBackdropNavigateAnonOpen={setBackdropNavigateAnonOpen}
      />
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
