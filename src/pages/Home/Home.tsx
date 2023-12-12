import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

function Home() {
  return (
    <>
      <Container>
        <div
          style={
            {
              // backgroundImage: `url(${RocketShip})`,
              // backgroundRepeat: "no-repeat",
              // backgroundPosition: "top right",
              // minHeight: "800px",
              // background: "theme.palette.background.default",
              // backgroundImage:
              // "linear-gradient(to top, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
            }
          }
        >
          <Box mt={20}>
            <h1>To infinity and beyond!</h1>
            <p>...at your own pace</p>
          </Box>
        </div>
      </Container>
    </>
  );
}

export default Home;
