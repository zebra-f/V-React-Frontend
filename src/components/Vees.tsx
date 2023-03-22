import * as React from "react";
import { useState } from "react";

import useLocalStorageState from "use-local-storage-state";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Outlet, Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface AppProps {
  setMeasurementSystem: React.Dispatch<
    React.SetStateAction<"metric" | "imperial">
  >;
  measurementSystem: "metric" | "imperial";
}

export default function Vees(props: AppProps) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [alignment, setAlignment] = useState<"metric" | "imperial">(
    props.measurementSystem
  );

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "metric" | "imperial"
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      props.setMeasurementSystem(newAlignment);
    }
  };
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(233, 236, 239, 0.7)";
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-around"
        mt={4}
        sx={{ width: "100%" }}
        style={{ background: backgroundColor }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab sx={{ pt: 5 }} label="Speed" to="/vees" component={Link} />
          <Tab
            sx={{ pt: 5 }}
            label="Length"
            to="/vees/length"
            component={Link}
          />
        </Tabs>

        <ToggleButtonGroup
          orientation="vertical"
          value={alignment}
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
      </Box>
      <Outlet />
    </>
  );
}
