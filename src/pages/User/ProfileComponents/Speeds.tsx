import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface props {
  measurementSystem: "metric" | "imperial";
}
export default function ProfileSpeeds({ measurementSystem }: props) {
  const [value, setValue] = useState(0);
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
          <Tab
            sx={{ pt: 2 }}
            label="My Speeds"
            to="myspeeds"
            component={Link}
          />
          <Tab
            sx={{ pt: 2 }}
            label="Likes & Dislikes"
            to="likesdislikes"
            component={Link}
          />
          <Tab
            sx={{ pt: 2 }}
            label="Bookmarks"
            to="bookmarks"
            component={Link}
          />
        </Tabs>
      </Box>
      <Outlet />
    </>
  );
}
