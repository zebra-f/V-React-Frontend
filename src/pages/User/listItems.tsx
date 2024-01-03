import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyIcon from "@mui/icons-material/Key";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import StraightenIcon from "@mui/icons-material/Straighten";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Outlet, Link } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    {/* <Tabs value={value} onChange={handleChange} centered>
      <Tab sx={{ pt: 5 }} label="Speed" to="/vees" component={Link} />
      <Tab sx={{ pt: 5 }} label="Length" to="/vees/length" component={Link} />
    </Tabs> */}
    <ListItem>
      <ListItemIcon></ListItemIcon>
    </ListItem>
    <ListItemButton to="/account/myaccount" component={Link}>
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="My account" />
    </ListItemButton>
    <ListItemButton to="/account/changepassword" component={Link}>
      <ListItemIcon>
        <KeyIcon />
      </ListItemIcon>
      <ListItemText primary="Password change" />
    </ListItemButton>
    <ListItemButton to="/account/deleteaccount" component={Link}>
      <ListItemIcon>
        <DeleteForeverIcon />
      </ListItemIcon>
      <ListItemText primary="Delete my account" />
    </ListItemButton>
    <ListItem>
      <ListItemIcon></ListItemIcon>
    </ListItem>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItem>
      <ListItemIcon></ListItemIcon>
    </ListItem>
    <ListItemButton>
      <ListItemIcon>
        <SpeedIcon />
      </ListItemIcon>
      <ListItemText primary="Speeds" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <StraightenIcon />
      </ListItemIcon>
      <ListItemText primary="Lengths" />
    </ListItemButton>
  </React.Fragment>
);
