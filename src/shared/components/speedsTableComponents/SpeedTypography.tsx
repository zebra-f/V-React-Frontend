import { useMeasurementSystem } from "../../contexts/MeasurementSystem";

import Typography from "@mui/material/Typography";

interface speedTypographyProps {
  kmph: number;
  mph: number | undefined;
  variant: any;
}
export default function SpeedTypography({
  kmph,
  mph,
  variant,
}: speedTypographyProps) {
  const [measurementSystem] = useMeasurementSystem();

  if (mph) {
    return (
      <Typography variant={variant !== null ? variant : undefined}>
        {measurementSystem == "metric"
          ? `${Number(String(kmph.toFixed(kmph < 1 ? 10 : 2)))} kmph`
          : `${Number(String(mph.toFixed(mph < 1 ? 10 : 2)))} mph`}
      </Typography>
    );
  }

  return (
    <Typography>
      {measurementSystem == "metric"
        ? `${Number(String(kmph.toFixed(kmph < 1 ? 10 : 2)))} kmph`
        : `${Number(String((kmph * 0.621371).toFixed(kmph * 0.621371 < 1 ? 10 : 2)))} mph`}
    </Typography>
  );
}
