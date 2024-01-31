import { useRef, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import SpeedTable from "../../../shared/components/SpeedTable";

import PublicProfileSpeeds from "./SpeedsPersonalComponents/PublicProfileSpeeds";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Outlet, Link } from "react-router-dom";
import Container from "@mui/material/Container";

interface props {
  measurementSystem: "metric" | "imperial";
}
export default function ProfileSpeeds({ measurementSystem }: props) {
  const { userName } = useParams();

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
      {!userName ? (
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
                to="/profile/speeds/myspeeds"
                state={{ measurementSystem: measurementSystem }}
                component={Link}
              />
              <Tab
                sx={{ pt: 2 }}
                label="Likes & Dislikes"
                to="/profile/speeds/likesdislikes"
                component={Link}
              />
              <Tab
                sx={{ pt: 2 }}
                label="Bookmarks"
                to="/profile/speeds/bookmarks"
                component={Link}
              />
            </Tabs>
          </Box>
          <Outlet />
        </>
      ) : (
        <PublicProfileSpeeds measurementSystem={measurementSystem} />
      )}
    </>
  );
}
