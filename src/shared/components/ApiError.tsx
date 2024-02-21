import { apiErrorStateInterface } from "../interfaces/apiInterfaces";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

export default function ApiError({
  apiError,
  setApiError,
}: apiErrorStateInterface) {
  return (
    <>
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
    </>
  );
}
