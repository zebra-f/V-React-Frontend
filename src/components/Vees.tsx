import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Outlet, Link } from "react-router-dom";

export default function Vees() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Speed" to="/vees" component={Link} />
          <Tab label="Length" to="/vees/length" component={Link} />
        </Tabs>
      </Box>
      <Outlet />
    </>
  );
}
