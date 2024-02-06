import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface props {
  setMeasurementSystem: React.Dispatch<
    React.SetStateAction<"metric" | "imperial">
  >;
  measurementSystem: "metric" | "imperial";
}
export default function ProfileSpeeds({
  setMeasurementSystem,
  measurementSystem,
}: props) {
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

  const [alignment, setAlignment] = useState<"metric" | "imperial">(
    measurementSystem,
  );
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "metric" | "imperial",
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      setMeasurementSystem(newAlignment);
    }
  };
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
