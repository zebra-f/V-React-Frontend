import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyIcon from "@mui/icons-material/Key";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import StraightenIcon from "@mui/icons-material/Straighten";
import { Link } from "react-router-dom";

export const mainListItems = (
  <>
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
  </>
);

export const secondaryListItems = (
  <>
    <ListItem>
      <ListItemIcon></ListItemIcon>
    </ListItem>

    <ListItemButton to="/account/profile/speeds" component={Link}>
      <ListItemIcon>
        <SpeedIcon />
      </ListItemIcon>
      <ListItemText primary="Speeds" />
    </ListItemButton>

    <ListItemButton
      to="/account/profile/lengths"
      disabled={true}
      component={Link}
    >
      <ListItemIcon>
        <StraightenIcon />
      </ListItemIcon>
      <ListItemText primary="Lengths" />
    </ListItemButton>
  </>
);

export const secondaryListRedirect = (
  <>
    <ListItem>
      <ListItemIcon></ListItemIcon>
    </ListItem>

    <ListItemButton to="/account/myaccount" component={Link}>
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Account" />
    </ListItemButton>
  </>
);
