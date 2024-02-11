import { useState } from "react";
import { useParams, useLocation, Outlet, Link } from "react-router-dom";

import MeasurementSystemToogleButtonGroup from "../../shared/components/MeasurementSystemToogleButtonGroup";

import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Stack from "@mui/material/Stack";

export default function PublicProfile() {
  const { userName } = useParams();

  const theme = useTheme();

  const location = useLocation();
  const initialValue = location.pathname.includes("lengths") ? 1 : 0;
  const [value, setValue] = useState(initialValue);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(233, 236, 239, 0.7)";
  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" gap={1} my={2}>
          <AccountBoxIcon fontSize="large" />
          <Typography variant="h3">{userName}</Typography>
        </Stack>
      </Container>

      <Box
        display="flex"
        justifyContent="space-around"
        sx={{ width: "100%" }}
        style={{ background: backgroundColor }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab
            sx={{ pt: 5 }}
            label="Speeds"
            to={`/profile/${userName}/speeds`}
            component={Link}
          />
          <Tab
            sx={{ pt: 5 }}
            label="Lengths"
            to={`/profile/${userName}/lengths`}
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
