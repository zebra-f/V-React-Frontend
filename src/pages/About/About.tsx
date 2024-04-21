import useTheme from "@mui/material/styles/useTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grow from "@mui/material/Grow";
import Link from "@mui/material/Link";

import SovertisLogo from "../../assets/logo/sovertis-550x550-logo-02.svg";

import { Image } from "mui-image";

export default function About() {
  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(9, 10, 15, 0.9)"
      : "rgba(251, 254, 251, 0.0)";

  return (
    <Box sx={{ backgroundColor: backgroundColor }}>
      <Container
        component="main"
        maxWidth="md"
        sx={{ maxHeight: "90vh", overflow: "scroll" }}
      >
        <CssBaseline />

        <Box
          sx={{
            paddingTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grow
            in={true}
            style={{ transformOrigin: "0 0 0" }}
            {...(true ? { timeout: 1400 } : {})}
          >
            <img src={SovertisLogo} height={150} width={150} />
          </Grow>
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
            feeling lost in the sea of numbers.{" "}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 0,
            }}
          ></Typography>
          This tool makes it easy to see and compare how fast things move across
          any distance.
          <Typography
            variant="subtitle1"
            sx={{
              mt: 0,
            }}
          >
            By gaining insights into the velocities that shape our world,
            including those exhibited by animals and natural phenomena, we
            deepen our appreciation for the intricacies of the universe and the
            remarkable feats achieved by humanity's quest for knowledge and
            progress.{" "}
          </Typography>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mt: 8,
              letterSpacing: ".3rem",
            }}
          >
            Data
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
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: 0,
            }}
          >
            Contribute
          </Typography>
          <Typography variant="subtitle1">
            After logging in to your profile, you have the option to input speed
            data like the average baseball throw by a professional player, top
            speed of your favorite car or anything you can think of.
            <br /> Your contribution helps build a richer experience for
            everyone on our platform.
            <br /> Remember, it's important to research the correctness of the
            provided data to ensure accuracy and reliability.
            <br />
            <br /> Thanks for being part of our community!
          </Typography>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mt: 8,
              letterSpacing: ".3rem",
            }}
          >
            Open Source
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
            }}
          >
            You can freely access and scrutinize the{" "}
            <Link href="https://github.com/zebra-f/V">Source Code</Link> behind
            Soveritis. This commitment to transparency offers several key
            benefits:
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
            }}
          >
            • Every line of code is open to inspection, fostering trust and
            understanding of how the project functions.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
            }}
          >
            • Openness promotes accountability and ensures that the project
            operates ethically and responsibly.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
            }}
          >
            • The wider community can actively participate in finding and
            resolving vulnerabilities, improving the overall security and
            stability of the project.
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mt: 2,
              mb: 4,
            }}
          >
            Architecture
          </Typography>
          {theme.palette.mode == "dark" ? (
            <Image
              src={"./architecture/d4-dark-v2.drawio.png"}
              duration={500}
            />
          ) : (
            <Image
              src={"./architecture/d4-light-v2.drawio.png"}
              duration={500}
            />
          )}
          <Typography
            variant="h5"
            noWrap
            sx={{
              mt: 8,
              letterSpacing: ".3rem",
            }}
          >
            Contact
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: 20,
            }}
          >
            email: contact@sovertis.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
