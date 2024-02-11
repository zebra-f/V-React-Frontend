import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import MeasurementSystemToogleButtonGroup from "../../../shared/components/MeasurementSystemToogleButtonGroup";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function ProfileSpeeds() {
  const location = useLocation();
  let initialValue = 0;
  if (location.pathname.includes("feedback")) {
    initialValue = 1;
  } else if (location.pathname.includes("bookmarks")) {
    initialValue = 2;
  }
  const [value, setValue] = useState(initialValue);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(233, 236, 239, 0.7)";

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-around"
        sx={{ width: "100%" }}
        style={{ background: backgroundColor }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab sx={{ pt: 5 }} label="My Speeds" to="speeds" component={Link} />
          <Tab
            sx={{ pt: 5 }}
            label="My Feedback History"
            to="feedback"
            component={Link}
          />
          <Tab
            sx={{ pt: 5 }}
            label="My Bookmarks"
            to="bookmarks"
            component={Link}
          />
        </Tabs>

        <MeasurementSystemToogleButtonGroup />
      </Box>
      <Outlet />
    </>
  );
}
