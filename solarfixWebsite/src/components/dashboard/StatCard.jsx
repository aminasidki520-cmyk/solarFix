// src/components/dashboard/StatCard.jsx
import React from "react";
import { Card, Typography, Box, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import { colors } from "../../theme";

export default function StatCard({
  compact = false,
  title,
  value,
  icon,
  variant = "default",
  trendDirection = "neutral",
  trendText = "",
  onClick,
}) {
  const isFilled = variant === "filled";

  const trendIcon =
    trendDirection === "up" ? <ArrowUpwardIcon sx={{ fontSize: 10 }} /> :
    trendDirection === "down" ? <ArrowDownwardIcon sx={{ fontSize: 10 }} /> :
    <RemoveIcon sx={{ fontSize: 10 }} />;

  const trendColor = isFilled
    ? "rgba(255,255,255,0.85)"
    : trendDirection === "up" ? colors.primaryLight
    : trendDirection === "down" ? colors.danger
    : colors.textMuted;

  // 🚀 REDUCTION DRASTIQUE DES DIMENSIONS
  const cardPadding = compact ? 0.75 : 1.5; // Padding intérieur beaucoup plus petit
  const iconSize = compact ? 20 : 26;       // Icone plus petite
  const valueVariant = compact ? "h6" : "h5";
  const titleVariant = compact ? "caption" : "body2";

  return (
    <Card
      elevation={0}
      className="stat-card" // Permet d'utiliser le style CSS parent
      sx={{
        flex: "1 1 140px",
        minWidth: 120,
        p: cardPadding,
        borderRadius: "14px",
        backgroundColor: isFilled ? colors.primary : colors.white,
        border: isFilled ? "none" : `1px solid ${colors.border}`,
        transition: "0.2s",
        "&:hover": { transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: iconSize, height: iconSize, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isFilled ? "rgba(255,255,255,0.16)" : colors.primaryTint, color: isFilled ? "#FFFFFF" : colors.primary }}>
            {icon}
          </Box>
          <Typography variant={titleVariant} fontWeight={600} fontSize={compact ? "0.65rem" : "0.8rem"} color={isFilled ? "#FFFFFF" : colors.textSecondary}>
            {title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClick} sx={{ width: compact ? 18 : 22, height: compact ? 18 : 22, color: isFilled ? "#FFFFFF" : colors.textMuted, backgroundColor: isFilled ? "rgba(255,255,255,0.16)" : colors.background, "&:hover": { backgroundColor: isFilled ? "rgba(255,255,255,0.28)" : colors.border } }}>
          <ChevronRightIcon fontSize="small" sx={{ fontSize: compact ? 14 : 18 }} />
        </IconButton>
      </Box>
      <Typography variant={valueVariant} fontWeight={800} color={isFilled ? "#FFFFFF" : colors.textPrimary} sx={{ mt: compact ? 0.5 : 1.25, mb: compact ? 0.25 : 0.75, letterSpacing: "-0.02em", fontSize: compact ? "1.25rem" : "1.5rem" }}>
        {value}
      </Typography>
      {trendText && (
        <Box display="flex" alignItems="center" gap={0.5} sx={{ color: trendColor }}>
          {trendIcon}
          <Typography variant="caption" fontWeight={600} fontSize={compact ? "0.55rem" : "0.7rem"} color="inherit">{trendText}</Typography>
        </Box>
      )}
    </Card>
  );
}