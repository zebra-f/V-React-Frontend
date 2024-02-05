import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface props {
  measurementSystem: "metric" | "imperial";
}
export default function ProfileSpeeds({ measurementSystem }: props) {
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
        mt={1}
        sx={{ width: "100%" }}
        style={{ background: backgroundColor }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab sx={{ pt: 2 }} label="My Speeds" to="speeds" component={Link} />
          <Tab
            sx={{ pt: 2 }}
            label="My Feedback"
            to="feedback"
            component={Link}
          />
          <Tab
            sx={{ pt: 2 }}
            label="My Bookmarks"
            to="bookmarks"
            component={Link}
          />
        </Tabs>
      </Box>
      <Outlet />
    </>
  );
}
