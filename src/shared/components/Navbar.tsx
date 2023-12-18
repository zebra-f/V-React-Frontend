import { useState, useContext, forwardRef, Dispatch } from "react";

import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import signOut from "../../actions/signOut";

import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ListItemText from "@mui/material/ListItemText";
import useTheme from "@mui/material/styles/useTheme";
import MoreIcon from "@mui/icons-material/MoreVert";
import styled from "@mui/material/styles/styled";
import Switch from "@mui/material/Switch";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import ButtonGroup from "@mui/material/ButtonGroup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { ColorModeContext } from "../../styles/ColorModeApp";

const pages = ["Home", "Vees", "About"];

interface props {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>;
  sessionThemeMode: string;
  setSessionThemeMode: Dispatch<React.SetStateAction<string>>;
}
export default function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  sessionThemeMode,
  setSessionThemeMode,
}: props) {
  const colorMode = useContext(ColorModeContext);
  const changeColorMode = () => {
    colorMode.toggleColorMode();
    setSessionThemeMode(sessionThemeMode === "dark" ? "light" : "dark");
  };
  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === "dark"
      ? "rgba(0,0,0,0)"
      : // ? "linear-gradient(0deg, rgba(9,10,15,1) 0%, rgba(27,39,53,0.2) 100%)"
        "rgba(0,0,0,0)";

  const activeStyleBackgroundColor =
    theme.palette.mode === "dark" ? "rgb(0,0,0,0)" : "rgba(0,0,0,0)";
  // NavLink highlight
  const activeStyle = {
    backgroundColor: activeStyleBackgroundColor,
    // textDecoration: "underline",
  };
  const CustomNavLink = forwardRef<any, any>((props, ref) => (
    <NavLink
      style={({ isActive }) => (isActive ? activeStyle : undefined)}
      ref={ref}
      {...props}
      className={({ isActive }) =>
        isActive ? props.className + " Mui-selected" : props.className
      }
    />
  ));

  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate("/signin");
  };
  const handleSignUpClick = () => {
    navigate("/signup");
  };

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const drawerWidth = 240;
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 1.5 }}>
        SOVERTIS
      </Typography>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page} disablePadding>
            <ListItemButton
              component={CustomNavLink}
              to={page.toLowerCase() === "home" ? "/" : page.toLowerCase()}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={page} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Mobile menu
  const mobileMenuId = "primary-search-account-menu-mobile";
  const menuId = "primary-search-account-menu";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem sx={{ justifyContent: "center" }}>
        <MaterialUISwitch
          checked={theme.palette.mode == "light" ? true : false}
          onClick={changeColorMode}
        />
      </MenuItem>
      {isAuthenticated ? (
        <MenuItem
          onClick={handleProfileMenuOpen}
          sx={{ justifyContent: "center" }}
        >
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
          >
            <AccountCircle />
          </IconButton>
        </MenuItem>
      ) : (
        [
          <MenuItem
            key="placeholder1"
            onClick={() => {
              handleSignInClick();
              handleMenuClose();
            }}
          >
            Sign In
          </MenuItem>,
          <MenuItem
            key="placeholder2"
            onClick={() => {
              handleSignUpClick();
              handleMenuClose();
            }}
          >
            Sign Up
          </MenuItem>,
        ]
      )}
    </Menu>
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
    setErrorSnackbarOpen(false);
  };
  const handleSignOut = () => {
    signOut(isAuthenticated, setIsAuthenticated).then((signedOut) => {
      if (signedOut) {
        setErrorSnackbarOpen(false);
        setSuccessSnackbarOpen(true);

        navigate("/");
      } else {
        setErrorSnackbarOpen(true);
        setSuccessSnackbarOpen(false);
      }
    });
  };

  // pop up user menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleSignOut();
        }}
      >
        Sign Out
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        sx={{ mt: 6 }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          You have been signed out successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorSnackbarOpen}
        autoHideDuration={8000}
        onClose={handleCloseAlert}
        sx={{ mt: 6 }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          Something went wrong.
        </Alert>
      </Snackbar>

      <Slide appear={true} direction="down" in={!useScrollTrigger()}>
        <AppBar
          elevation={0}
          position="sticky"
          sx={{ pt: 0 }}
          style={{ background: backgroundColor }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "Montserrat",
                  letterSpacing: ".4rem",
                  color: theme.palette.mode === "light" ? "#028090" : "#55B8FF",
                  textDecoration: "none",
                }}
              >
                SOVERTIS
              </Typography>

              {/* drawer icon */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                }}
              >
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* mobile title and logo */}
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "Montserrat",
                  letterSpacing: ".4rem",
                  color: theme.palette.mode === "light" ? "#028090" : "#55B8FF",
                  textDecoration: "none",
                }}
              >
                SOVERTIS
              </Typography>

              {/* top left */}
              <Box
                height={70}
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                {pages.map((page) => (
                  <Button
                    component={CustomNavLink}
                    to={
                      page.toLowerCase() === "home" ? "/" : page.toLowerCase()
                    }
                    key={page}
                    sx={{
                      // my: 2,
                      // color: "white",
                      display: "block",
                      pt: 3.2,
                      px: 2.4,
                    }}
                  >
                    <Typography variant="button" sx={{}}>
                      {page}
                    </Typography>
                  </Button>
                ))}
              </Box>

              {/* top right */}
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MaterialUISwitch
                  sx={{ m: 1 }}
                  checked={theme.palette.mode == "light" ? true : false}
                  onClick={changeColorMode}
                />
                {isAuthenticated ? (
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                  >
                    <AccountCircle />
                  </IconButton>
                ) : (
                  <>
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                      size="small"
                    >
                      <Button onClick={handleSignInClick}>Sign In</Button>
                      <Button onClick={handleSignUpClick}>Sign Up</Button>
                    </ButtonGroup>
                  </>
                )}
              </Box>

              {/* top right mobile */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>
      {/* mobile drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      {/* Mobile menu */}
      <Box>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </>
  );
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#1F1F20" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#3c4576" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#346aac" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
