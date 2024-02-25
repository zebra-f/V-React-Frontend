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
      ? "rgba(9, 10, 15, 0.9)"
      : "rgba(251, 254, 251, 0.9)";

  return (
    <Box sx={{ backgroundColor: backgroundColor }}>
      <Container component="main" maxWidth="md">
        <CssBaseline />

        <Box
          sx={{
            paddingTop: 8,
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
              letterSpacing: ".3rem",
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
              letterSpacing: ".3rem",
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
            The human fascination with speed transcends mere entertainment. It
            fuels scientific inquiry, pushes technological boundaries, and
            shapes our understanding of the universe. Despite our innate
            curiosity, truly comprehending the vast range of speeds across the
            universe, from the imperceptible blink of a hummingbird's wing to
            the mind-bending velocity of light, can be daunting and leave us
            feeling lost in the sea of numbers. This tool makes it easy to see
            and compare how fast things move across any distance.
          </Typography>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mt: 8,
              letterSpacing: ".3rem",
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
            reporting discrepancies, or adding new objects to the database.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default About;
