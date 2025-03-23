import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Questionnaire Builder
          </Link>
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{
                fontWeight: isActive("/") ? "bold" : "normal",
                textDecoration: isActive("/") ? "underline" : "none",
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/create"
              color="inherit"
              sx={{
                fontWeight: isActive("/create") ? "bold" : "normal",
                textDecoration: isActive("/create") ? "underline" : "none",
              }}
            >
              Create
            </Button>
            <Button
              component={Link}
              to="/stats"
              color="inherit"
              sx={{
                fontWeight: isActive("/stats") ? "bold" : "normal",
                textDecoration: isActive("/stats") ? "underline" : "none",
              }}
            >
              Statistics
            </Button>
          </Box>
        )}

        {isMobile && (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={Link}
                to="/"
                onClick={handleMenuClose}
                sx={{
                  fontWeight: isActive("/") ? "bold" : "normal",
                }}
              >
                Home
              </MenuItem>
              <MenuItem
                component={Link}
                to="/create"
                onClick={handleMenuClose}
                sx={{
                  fontWeight: isActive("/create") ? "bold" : "normal",
                }}
              >
                Create
              </MenuItem>
              <MenuItem
                component={Link}
                to="/stats"
                onClick={handleMenuClose}
                sx={{
                  fontWeight: isActive("/stats") ? "bold" : "normal",
                }}
              >
                Statistics
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
