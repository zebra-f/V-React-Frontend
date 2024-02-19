import { useState } from "react";

import { useIsAuthenticated } from "../../contexts/IsAuthenticated";

import ReportForm from "../ReportForm";
import BackdropNavigateAnon from "./BackdropNavigateAnon";

import { speedInterface } from "../../interfaces/speedInterfaces";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Report";

interface reportPropsInterface {
  speed: null | speedInterface;
}
export default function Report({ speed }: reportPropsInterface) {
  const [isAuthenticaed] = useIsAuthenticated();
  const [backdropNavigateAnonOpen, setBackdropNavigateAnonOpen] =
    useState(false);

  const [reportFormOpen, setReportFormOpen] = useState<boolean>(false);

  const handleReportButton = () => {
    if (!isAuthenticaed) {
      setBackdropNavigateAnonOpen(true);
      return;
    }
    setReportFormOpen(true);
  };

  return (
    <>
      <BackdropNavigateAnon
        backdropNavigateAnonOpen={backdropNavigateAnonOpen}
        setBackdropNavigateAnonOpen={setBackdropNavigateAnonOpen}
      />
      {reportFormOpen && (
        <ReportForm
          formOpen={reportFormOpen}
          setFormOpen={setReportFormOpen}
          speedData={speed}
        />
      )}

      <Button onClick={handleReportButton}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography>Report</Typography>
          <ReportIcon color="error" />
        </Stack>
      </Button>
    </>
  );
}
