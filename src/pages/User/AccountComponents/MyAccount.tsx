import { useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListSubheader from "@mui/material/ListSubheader";

import kyClient from "../../../shared/services/ky";

async function requestWhoami() {
  try {
    const jsonResponse = kyClient.backendApi.get("users/whoami/").json();
    return jsonResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default function MyAccount() {
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
    created_at: "",
    updated_at: "",
    last_login: "",
    oauth_providers: [],
  });

  useEffect(() => {
    requestWhoami()
      .then((jsonResponse: any) => {
        const datesArray = ["created_at", "updated_at", "last_login"];
        for (const [key, _value] of Object.entries(jsonResponse)) {
          if (datesArray.includes(key)) {
            var date = new Date(jsonResponse[key]);
            jsonResponse[key] = date;
          }
        }
        if (jsonResponse.oauth_providers.length === 0) {
          jsonResponse.oauth_providers = "None";
        }
        setUserData(jsonResponse);
      })
      .catch((_: any) => {});
  }, []);
  return (
    <>
      <Paper
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <List
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              sx={{ mt: 2 }}
            >
              <Typography variant="h5" gutterBottom>
                Main
              </Typography>
            </ListSubheader>
          }
          sx={{
            overflow: "auto",
            bgcolor: "background.paper",
          }}
        >
          <ListItem sx={{ mr: 2 }}>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText
              primary={`${userData.email}\u00A0\u00A0\u00A0`}
              secondary="Email"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText
              primary={`${userData.username}\u00A0\u00A0\u00A0`}
              secondary="Username"
            />
          </ListItem>
        </List>
        {/* Detail */}
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              <Typography variant="h5" gutterBottom>
                Detail
              </Typography>
            </ListSubheader>
          }
          sx={{
            overflow: "auto",
            bgcolor: "background.paper",
          }}
        >
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText
              primary={`${userData.id}\u00A0\u00A0\u00A0`}
              secondary="ID"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText
              primary={`${userData.last_login}\u00A0\u00A0\u00A0`}
              secondary="Last Login"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText
              primary={`${userData.updated_at}\u00A0\u00A0\u00A0`}
              secondary="Updated At"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText
              primary={`${userData.created_at}\u00A0\u00A0\u00A0`}
              secondary="Created At"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar></ListItemAvatar>
            <ListItemText
              primary={`${userData.oauth_providers}`}
              secondary="OAuth providers"
            />
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
