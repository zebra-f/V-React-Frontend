import * as React from "react";
import { useState } from "react";

import MeasurementSystemToogleButtonGroup from "../../shared/components/MeasurementSystemToogleButtonGroup";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Outlet, Link } from "react-router-dom";

export default function Data() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
          <Tab
            sx={{ pt: 5 }}
            label="Speed"
            to="/data/speeds"
            component={Link}
          />
          <Tab
            sx={{ pt: 5 }}
            label="Length"
            to="/data/lengths"
            component={Link}
            disabled={true}
          />
        </Tabs>

        <MeasurementSystemToogleButtonGroup />
      </Box>
      <Outlet />
    </>
  );
}
