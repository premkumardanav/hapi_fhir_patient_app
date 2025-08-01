// components/Layout.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleMode } from "../redux/slices/theme";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/auth";
import LogoutButton from "./auth/LogoutButton";

const Layout = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleToggle = () => {
    dispatch(toggleMode());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Management Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleToggle}>
            {mode === "dark" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          {isLoggedIn && <LogoutButton onClick={handleLogout} />}
        </Toolbar>
      </AppBar>
      <Box p={3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
