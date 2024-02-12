import { useState } from "react";

import ReportForm from "../ReportForm";

import { speedInterface } from "../../interfaces/speedInterfaces";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Report";

interface reportPropsInterface {
  speed: null | speedInterface;
}
export default function Report({ speed }: reportPropsInterface) {
  const [reportFormOpen, setReportFormOpen] = useState<boolean>(false);
  const handleReportButton = () => {
    setReportFormOpen(true);
  };

  return (
    <>
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
