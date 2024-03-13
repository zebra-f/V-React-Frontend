import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Home() {
  return (
    <>
      <Container>
        <Box mt={20}>
          <Typography
            variant="h5"
            sx={{
              mt: 4,
              letterSpacing: ".2rem",
            }}
          >
            Dynamic Object Visualization
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              letterSpacing: ".1rem",
            }}
          >
            Exploring Movement Through Time and Distance
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default Home;
