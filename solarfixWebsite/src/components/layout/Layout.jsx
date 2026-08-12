// src/components/layout/Layout.jsx
import React, { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme as useMuiTheme, IconButton } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { colors } from "../../theme";

const routeTitles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/tickets": "Tickets",
  "/equipment": "Equipment",
  "/technicians": "Technicians",
  "/inventory": "Inventory",
  "/reports": "Reports",
  "/settings": "Settings",
  "/profile": "Profile",
};

export default function Layout() {
  const muiTheme = useMuiTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const currentTitle = routeTitles[location.pathname] || "Page";

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: colors.bg,
        color: colors.textPrimary,
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {isDesktop ? (
        <Sidebar collapsed={sidebarCollapsed} />
      ) : (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: 256, border: "none" } }}
        >
          <Sidebar collapsed={false} />
        </Drawer>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Navbar
          pageTitle={currentTitle}
          hasNotifications={false}
          onMenuClick={!isDesktop ? () => setMobileOpen(true) : undefined}
          onToggleSidebar={isDesktop ? toggleSidebar : undefined}
          sidebarCollapsed={sidebarCollapsed}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 2.5 },
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: colors.border, borderRadius: "3px" },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}