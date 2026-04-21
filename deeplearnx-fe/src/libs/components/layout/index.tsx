import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/shell/redux/store";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { SUPERADMIN } from "@/libs/constants/roles.constant";
import { PATHS_CONFIG } from "@/shell/route/path.config";
import HeaderComponent from "./header.component";
import ClockComponent from "./clock.component";

const DRAWER_WIDTH = 220;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const roles = useSelector((state: RootState) => state.auth.roles);

  const navItems = PATHS_CONFIG.filter(
    (r) =>
      !r.hidden &&
      (r.roles.some((role) => roles.includes(role)) ||
        roles.includes(SUPERADMIN)),
  );

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ height: 64, borderBottom: "1px solid #e0e0e0" }} />

      <List sx={{ px: 1, pt: 1 }}>
        {navItems.map((route) => {
          const isActive = location.pathname.includes(route.path);
          return (
            <ListItem key={route.key} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(route.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "#e8f0fe",
                    color: "#1a73e8",
                    "& .MuiListItemIcon-root": { color: "#1a73e8" },
                  },
                  "&.Mui-selected:hover": { bgcolor: "#d2e3fc" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{route.icon}</ListItemIcon>
                <ListItemText
                  primary={route.label}
                  slotProps={{
                    primary: {
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{ minHeight: "64px !important", justifyContent: "space-between" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen((v) => !v)}
              sx={{ display: { sm: "none" }, color: "#3c4043", mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #4facfe, #00f2fe)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: 25,
                  fontWeight: 800,
                  fontStyle: "italic",
                }}
              >
                Deeplearn
              </Box>
              <Box
                component="span"
                sx={{
                  color: "#111",
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                X
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ClockComponent />
            <HeaderComponent />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar — mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>

      {/* Sidebar — desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid #e0e0e0",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: "64px",
          height: "calc(100vh - 64px)",
          overflow: "auto",
          "&::-webkit-scrollbar": { width: 6, height: 6 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "#a0a0a0" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
