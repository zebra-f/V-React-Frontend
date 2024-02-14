import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useMeasurementSystem } from "../../shared/contexts/MeasurementSystem";

import { getSpeed } from "../../shared/services/speeds/getData";

import { speedInterface } from "../../shared/interfaces/speedInterfaces";

import Report from "../../shared/components/speedsTableComponents/Report";
import Bookmark from "../../shared/components/speedsTableComponents/Bookmark";
import Feedback from "../../shared/components/speedsTableComponents/Feedback";
import AddedBy from "../../shared/components/speedsTableComponents/AddedBy";
import AddToVees from "../../shared/components/speedsTableComponents/AddToVees";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

interface resultInterface {
  status: number;
  data: speedInterface;
}
export default function SpeedDetail() {
  const { speedId } = useParams();

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

  const [speed, setSpeed] = useState<speedInterface | any>(null);

  const [measurementSystem, setMeasurementSystem] = useMeasurementSystem();

  useEffect(() => {
    if (!speedId) {
      return;
    }
    getSpeed(speedId).then((result: resultInterface) => {
      if (result.status === 200) {
        setSpeed(result.data);
      } else if (result.status === 500) {
      } else {
      }
    });
  }, []);

  console.log(speedId);

  return (
    <Container maxWidth="md">
      {speed && (
        <Box mt={8}>
          <Box display="flex" justifyContent="space-between">
            <Container>
              {speed.tags.map((tag: string) => (
                <Chip key={tag} label={tag} variant="outlined" sx={{ mr: 1 }} />
              ))}
            </Container>

            <Stack direction={"row"}>
              <Bookmark
                speed={speed}
                setSpeed={setSpeed}
                setApiError={setApiError}
              />
              <AddToVees speed={speed} />
            </Stack>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Typography variant="h5" gutterBottom>
              {measurementSystem == "metric"
                ? `${speed.kmph} kmph`
                : `${speed.kmph * 0.621371} mph`}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Typography variant="h4" gutterBottom>
              {speed.name}
            </Typography>
          </Box>
          <Typography mt={4} variant="h5" gutterBottom>
            {speed.description}
          </Typography>
          <AddedBy user={speed.user} />

          <Divider sx={{ my: 4 }} />
          <Box display="flex" justifyContent="space-between">
            <Feedback
              speed={speed}
              setSpeed={setSpeed}
              rowType={"regular"}
              setApiError={setApiError}
            />
            <Report speed={speed} />
          </Box>
        </Box>
      )}
    </Container>
  );
}
