import { useNavigate } from "react-router-dom";

import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";

interface bookmarkPropsInterface {
  backdropNavigateAnonOpen: true | false;
  setBackdropNavigateAnonOpen: React.Dispatch<
    React.SetStateAction<true | false>
  >;
}
export default function BackdropNavigateAnon({
  backdropNavigateAnonOpen,
  setBackdropNavigateAnonOpen,
}: bookmarkPropsInterface) {
  const navigate = useNavigate();

  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.4)"
      : "rgba(233, 236, 239, 0.4)";

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={backdropNavigateAnonOpen}
      onClick={() => setBackdropNavigateAnonOpen(false)}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Button
          onClick={() => {
            navigate("/signin");
          }}
          sx={{ background: backgroundColor, color: "white" }}
        >
          <Typography component="h1" variant="h5">
            Click here and Sign In to perform this action.
          </Typography>
        </Button>
      </Box>
    </Backdrop>
  );
}
