import { Navigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

function GoogleRedirect() {
  const openerWindow = window.opener;
  if (openerWindow && !openerWindow.closed) {
    const openerOrigin = openerWindow.location.origin;

    const url = window.location.href;
    const questionMarkIndex = url.indexOf("?");
    if (questionMarkIndex !== -1) {
      const queryParams = url.slice(questionMarkIndex);
      openerWindow.postMessage(queryParams, openerOrigin);
    } else {
      openerWindow.postMessage("", openerOrigin);
    }
    window.close();
  } else {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Container>
        <Box
          sx={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Be patient. It shouldn't take too long.</h2>
          <CircularProgress />
        </Box>
      </Container>
    </>
  );
}

export default GoogleRedirect;
