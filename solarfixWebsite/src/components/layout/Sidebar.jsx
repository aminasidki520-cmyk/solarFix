// src/components/layout/Sidebar.jsx
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";

import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme";

const menuItems = [
  { text: "Dashboard", icon: <GridViewOutlinedIcon fontSize="small" />, path: "/dashboard" },
  { text: "Tickets", icon: <ConfirmationNumberOutlinedIcon fontSize="small" />, path: "/tickets" },
  { text: "Reports", icon: <InsertDriveFileOutlinedIcon fontSize="small" />, path: "/reports" },
  { text: "Technicians", icon: <GroupsOutlinedIcon fontSize="small" />, path: "/technicians" },
];

const adminItems = [
  { text: "Users", icon: <PersonOutlineOutlinedIcon fontSize="small" />, path: "/users" },
  { text: "Settings", icon: <SettingsOutlinedIcon fontSize="small" />, path: "/settings" },
  { text: "Help", icon: <HelpOutlineOutlinedIcon fontSize="small" />, path: "/help" },
];

// Shared NavItem component, adapts to collapsed state
function NavItem({ item, isActive, collapsed }) {
  const content = (
    <ListItemButton
      component={NavLink}
      to={item.path}
      sx={{
        borderRadius: "10px",
        py: 0.9,
        px: collapsed ? 1 : 1.5,
        mb: 0.25,
        justifyContent: collapsed ? "center" : "flex-start",
        backgroundColor: isActive ? colors.brandSoft : "transparent",
        color: isActive ? colors.brandDark : colors.textSecondary,
        "&:hover": {
          backgroundColor: isActive ? colors.brandSoft : "rgba(0,0,0,0.03)",
          color: colors.textPrimary,
        },
      }}
    >
      <ListItemIcon
        sx={{
          color: isActive ? colors.brand : colors.textMuted,
          minWidth: collapsed ? 0 : 30,
          justifyContent: "center",
        }}
      >
        {item.icon}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: "0.87rem" }}
        />
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.text} placement="right" key={item.text}>
        {content}
      </Tooltip>
    );
  }
  return content;
}

export default function Sidebar({ collapsed = false }) {
  const { logout } = useAuth();
  const location = useLocation();

  // For collapsed mode, we hide section titles
  const showLabels = !collapsed;

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 256,
        flexShrink: 0,
        height: "100%",
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        userSelect: "none",
        color: colors.sidebarText,
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      <Box>
        {/* Brand header – adapts to collapsed */}
        <Box
          sx={{
            px: collapsed ? 1 : 2.5,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "8px",
              backgroundColor: colors.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <WbSunnyRoundedIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
          </Box>
          {!collapsed && (
            <Typography variant="body1" fontWeight={700} color={colors.textPrimary} letterSpacing="-0.01em">
              SolarFix
            </Typography>
          )}
        </Box>

        {/* Main navigation */}
        <Box sx={{ px: collapsed ? 0.5 : 1.5, mt: 1 }}>
          {showLabels && (
            <Typography
              variant="caption"
              sx={{ px: 1.5, mb: 1, display: "block", color: colors.textMuted, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.06em" }}
            >
              MENU
            </Typography>
          )}
          <List component="nav" disablePadding>
            {menuItems.map((item) => (
              <NavItem key={item.text} item={item} isActive={location.pathname === item.path} collapsed={collapsed} />
            ))}
          </List>

          {showLabels && (
            <Typography
              variant="caption"
              sx={{ px: 1.5, mb: 1, mt: 2.5, display: "block", color: colors.textMuted, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.06em" }}
            >
              ADMINISTRATION
            </Typography>
          )}
          <List component="nav" disablePadding>
            {adminItems.map((item) => (
              <NavItem key={item.text} item={item} isActive={location.pathname === item.path} collapsed={collapsed} />
            ))}
            {/* Logout button – also with tooltip when collapsed */}
            {collapsed ? (
              <Tooltip title="Logout" placement="right">
                <ListItemButton
                  onClick={logout}
                  sx={{
                    borderRadius: "10px",
                    py: 0.9,
                    px: 1,
                    justifyContent: "center",
                    color: colors.textSecondary,
                    "&:hover": { backgroundColor: colors.dangerSoft, color: colors.danger },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 0, justifyContent: "center" }}>
                    <LogoutOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton
                onClick={logout}
                sx={{
                  borderRadius: "10px",
                  py: 0.9,
                  px: 1.5,
                  color: colors.textSecondary,
                  "&:hover": { backgroundColor: colors.dangerSoft, color: colors.danger },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 30 }}>
                  <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500, fontSize: "0.87rem" }} />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Box>

      {/* Promo card – hidden when collapsed */}
      {!collapsed && (
        <Box sx={{ p: 1.5 }}>
          <Box
            sx={{
              borderRadius: "14px",
              overflow: "hidden",
              background: `linear-gradient(160deg, #EAF3E4 0%, #CFE6D2 60%, #A9D3B8 100%)`,
              p: 2,
              position: "relative",
            }}
          >
            <WbSunnyRoundedIcon sx={{ color: colors.solar, fontSize: 22, mb: 0.5 }} />
            <Typography fontWeight={700} fontSize="0.9rem" color={colors.textPrimary}>
              SolarFix
            </Typography>
            <Typography fontSize="0.75rem" color={colors.textSecondary} sx={{ mt: 0.25 }}>
              Reliable solar operations for a greener tomorrow
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}