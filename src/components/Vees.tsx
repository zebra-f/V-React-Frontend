import * as React from "react";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Outlet, Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Container from "@mui/material/Container";

interface AppProps {
  setMeasurementSystem: React.Dispatch<
    React.SetStateAction<"metric" | "imperial">
  >;
  measurementSystem: "metric" | "imperial";
}

export default function Vees(props: AppProps) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [alignment, setAlignment] = React.useState("metric");
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "metric" | "imperial" | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      props.setMeasurementSystem(newAlignment);
    }
  };
  // const backgroundColor = (theme.palette.mode === 'dark' ? )
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-around"
        mt={2}
        sx={{ width: "100%" }}
        style={{ background: "rgba(0, 0, 0, 0.1)" }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Speed" to="/vees" component={Link} />
          <Tab label="Length" to="/vees/length" component={Link} />
        </Tabs>

        <ToggleButtonGroup
          orientation="vertical"
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
          sx={{
            p: 1,
            bgcolor: theme.palette.background.default,
          }}
        >
          <ToggleButton
            value="metric"
            aria-label="left aligned"
            size="small"
            sx={{
              maxHeight: 26,
            }}
          >
            <Typography mt={0.5}>metric</Typography>
          </ToggleButton>
          <ToggleButton
            value="imperial"
            aria-label="right aligned"
            size="small"
            sx={{
              maxHeight: 26,
            }}
          >
            <Typography mt={0.5}>imperial</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Outlet />
    </>
  );
}
