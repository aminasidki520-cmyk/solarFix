// src/components/layout/Navbar.jsx
import React, { useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  InputBase,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme";

export default function Navbar({
  pageTitle = "",
  hasNotifications = false,
  onMenuClick,
  onToggleSidebar,
  sidebarCollapsed = false,
}) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const initials = (user?.username || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      sx={{
        height: 56,
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        px: { xs: 1.5, md: 2.5 },
        display: "flex",
        alignItems: "center", // Assure un alignement vertical parfait
        justifyContent: "space-between",
        gap: { xs: 1, md: 1.5 },
      }}
    >
      {/* LEFT SECTION */}
      <Box display="flex" alignItems="center" gap={1.5} sx={{ flex: "0 0 auto" }}>
        {onMenuClick && (
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: colors.textSecondary }}
          >
            <MenuOutlinedIcon />
          </IconButton>
        )}

        {onToggleSidebar && (
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              display: { xs: "none", md: "inline-flex" },
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              p: 0.5,
              width: 32,
              height: 32,
            }}
          >
            {sidebarCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        )}

        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: colors.textPrimary,
            whiteSpace: "nowrap",
            display: { xs: "none", sm: "block" },
          }}
        >
          {pageTitle}
        </Typography>
      </Box>

      {/* SEARCH BAR */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: colors.bg,
          border: `1px solid transparent`,
          borderRadius: "999px",
          px: 1.5,
          py: 0.6,
          width: "100%",
          maxWidth: 340,
          transition: "all 0.2s ease",
          "&:focus-within": {
            borderColor: colors.brand,
            boxShadow: `0 0 0 3px ${colors.brand}20`,
          },
          margin: "0 auto",
        }}
      >
        <SearchIcon sx={{ color: colors.textMuted, fontSize: 18, mr: 1 }} />
        <InputBase
          placeholder="Search tickets, equipment..."
          sx={{
            color: colors.textPrimary,
            fontSize: "0.8rem",
            width: "100%",
            "& input::placeholder": { color: colors.textMuted, opacity: 1 },
          }}
        />
      </Box>

      {/* RIGHT SECTION - Profile now perfectly constrained */}
      <Box display="flex" alignItems="center" gap={1} sx={{ flex: "0 0 auto" }}>
        <IconButton
          sx={{
            color: colors.textSecondary,
            backgroundColor: colors.bg,
            width: 25,
            height: 25,
            "&:hover": { backgroundColor: colors.border },
          }}
        >
          <Badge
            variant="dot"
            invisible={!hasNotifications}
            sx={{ "& .MuiBadge-badge": { backgroundColor: colors.brand } }}
          >
            <NotificationsNoneOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>

        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8, // Espacement resserré
            px: 1.2,
            py: 0.4, // Padding très fin pour éviter l'overflow
            borderRadius: "999px",
            cursor: "pointer",
            transition: "background 0.2s",
            "&:hover": { backgroundColor: colors.bg },
          }}
        >
          {/* 🚀 AVATAR Réduit à 30px */}
          <Avatar
            src={user?.avatarUrl}
            sx={{ width: 30, height: 30, bgcolor: colors.brand, fontSize: "0.7rem" }}
          >
            {initials}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.1 }}>
            {/* 🚀 TEXTES Légèrement réduits */}
            <Typography fontSize="0.8rem" fontWeight={600} color={colors.textPrimary}>
              {user?.username || "User"}
            </Typography>
            <Typography fontSize="0.65rem" color={colors.textMuted}>
              {user?.role || "Operator"}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: colors.textMuted, fontSize: 16 }} />
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><PersonOutlineOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText>My profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={logout}>
            <ListItemIcon><LogoutOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}