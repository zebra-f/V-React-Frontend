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
import MeasurementSystemToogleButtonGroup from "../../shared/components/MeasurementSystemToogleButtonGroup";

import useTheme from "@mui/material/styles/useTheme";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";

interface resultInterface {
  status: number;
  data: speedInterface;
}
export default function SpeedDetail() {
  const theme = useTheme();
  const { speedId } = useParams();

  const [apiError, setApiError] = useState({ error: false, errorMessage: "" });

  const [speed, setSpeed] = useState<speedInterface | any>(null);

  const [measurementSystem] = useMeasurementSystem();

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
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(233, 236, 239, 0.7)";

  return (
    <>
      {apiError.error && (
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setApiError({ error: false, errorMessage: "" });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ width: "100%", mt: 3 }}
          severity="error"
        >
          {apiError.errorMessage}
        </Alert>
      )}

      <Box
        display="flex"
        justifyContent="space-around"
        sx={{ width: "100%" }}
        style={{ background: backgroundColor }}
        mt={4}
      >
        <MeasurementSystemToogleButtonGroup />
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {speed && (
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Container>
                {speed.tags.map((tag: string) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
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
              <Tooltip
                title={
                  <>
                    <Typography fontSize={20}>
                      {speed.estimated
                        ? speed.speed_type + " (estimated) "
                        : speed.speed_type}
                    </Typography>
                    <Typography>
                      {measurementSystem == "metric"
                        ? `${speed.kmph} kmph`
                        : `${speed.kmph * 0.621371} mph`}
                    </Typography>
                  </>
                }
              >
                <Typography variant={undefined}>
                  {measurementSystem == "metric"
                    ? `${Number(String(speed.kmph.toFixed(speed.kmph < 1 ? 10 : 2)))} kmph`
                    : `${Number(String((speed.kmph * 0.621371).toFixed(speed.kmph * 0.621371 < 1 ? 10 : 2)))} mph`}
                </Typography>
              </Tooltip>
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
    </>
  );
}
