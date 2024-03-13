import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useMeasurementSystem } from "../contexts/MeasurementSystem";

export default function MeasurementSystemToogleButtonGroup() {
  const [measurementSystem, setMeasurementSystem] = useMeasurementSystem();

  const handleAlignment = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: "metric" | "imperial",
  ) => {
    if (newAlignment !== null) {
      setMeasurementSystem(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup
      orientation="vertical"
      value={measurementSystem}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      sx={{
        p: 1,
        pt: 1.2,
        // bgcolor: theme.palette.background.default,
        borderRadius: 0,
      }}
    >
      <ToggleButton
        value="metric"
        aria-label="left aligned"
        size="small"
        sx={{
          mx: 1,
          maxHeight: 26,
        }}
      >
        <Typography mt={0}>metric</Typography>
      </ToggleButton>
      <ToggleButton
        value="imperial"
        aria-label="right aligned"
        size="small"
        sx={{
          mx: 1,
          maxHeight: 26,
        }}
      >
        <Typography mt={0}>imperial</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
