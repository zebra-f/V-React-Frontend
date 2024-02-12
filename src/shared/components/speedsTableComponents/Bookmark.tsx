import { createSpeedBookmark } from "../../../actions/speed/bookmark";
import { deleteSpeedBookmark } from "../../../actions/speed/bookmark";

import { speedInterface } from "../../interfaces/speedInterfaces";

import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Button from "@mui/material/Button";

interface bookmarkPropsInterface {
  speed: speedInterface;
  setSpeed: null | React.Dispatch<React.SetStateAction<speedInterface>>;
  setApiError: null | any;
}
export default function Bookmark({
  speed,
  setSpeed,
  setApiError,
}: bookmarkPropsInterface) {
  const handleCreateBookmark = () => {
    if (!speed.user_speed_bookmark) {
      createSpeedBookmark(speed.id, null).then((result) => {
        if (result.status === 201) {
          const userSpeedBookmark = {
            bookmark_id: result.data.id,
            bookmark_category: result.data.category,
          };
          if (setSpeed) {
            setSpeed((prevState: any) => {
              return {
                ...prevState,
                user_speed_bookmark: userSpeedBookmark,
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
              errorMessage: "Something went wrong. Try again later",
            });
          }
        }
      });
    }
  };

  const handleDeleteBookmark = () => {
    if (speed.user_speed_bookmark) {
      deleteSpeedBookmark(speed.user_speed_bookmark.bookmark_id).then(
        (result) => {
          if (result.status === 204) {
            if (setSpeed) {
              setSpeed((prevState) => {
                return {
                  ...prevState,
                  user_speed_bookmark: null,
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
        },
      );
    }
  };

  return (
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
  );
}
