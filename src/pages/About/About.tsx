import Icon from "@mui/material/Icon";
import useTheme from "@mui/material/styles/useTheme";
import SovertisLogo from "../../assets/logo/sovertis-550x550-logo-02.svg";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function About() {
  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(233, 236, 239, 0.7)";
  return (
    <>
      <Container component="main" maxWidth="md">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={SovertisLogo} height={150} width={150} />
          <Typography
            variant="h4"
            noWrap
            sx={{
              mt: 4,
              letterSpacing: ".4rem",
            }}
          >
            ABOUT SOVERTIS
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mt: 8,
              letterSpacing: ".4rem",
            }}
          >
            Introduction
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
            }}
          >
            Welcome to Sovertis, a platform for visually comparing speeds to
            help us gain a better sense of the distance and time in which less
            common or common objects move through space.
          </Typography>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mt: 8,
              letterSpacing: ".4rem",
            }}
          >
            Data Sources
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
            }}
          >
            Data on Sovertis comes from users like you and only users like you
            can ensure its accuracy and correctness on this site.
          </Typography>
          <Typography variant="subtitle1">
            In this case each contribution play a crucial role in maintaining
            the reliability of this platform, either by actively voting,
            reporting discrepancies, or adding new well-reaserched objects to
            the database.
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default About;
