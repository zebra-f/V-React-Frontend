import Container from "@mui/material/Container";

function GoogleCallbackRedirect() {
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
  } else {
    return (
      <>
        <Container>You shouldn't be here.</Container>
      </>
    );
  }

  return (
    <>
      <Container>Be patient, it won't take long.</Container>
    </>
  );
}

export default GoogleCallbackRedirect;
