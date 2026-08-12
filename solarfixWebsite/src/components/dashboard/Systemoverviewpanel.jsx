// src/components/dashboard/SystemOverviewPanel.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { colors, glassPanel } from "../../theme";

function Metric({ compact, icon, label, value, trendText, trendDirection }) {
  const trendColor = trendDirection === "down" ? colors.danger : colors.success;
  const TrendIcon = trendDirection === "down" ? ArrowDownwardIcon : ArrowUpwardIcon;
  const iconSize = compact ? 30 : 42;
  const valueFont = compact ? "1.1rem" : "1.35rem";

  return (
    <Box display="flex" alignItems="center" gap={compact ? 1 : 1.5} sx={{ flex: "1 1 180px", minWidth: 160 }}>
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: "50%",
          backgroundColor: colors.primaryTint, // 🚀 colors.brandSoft -> colors.primaryTint
          color: colors.primary, // 🚀 colors.brand -> colors.primary
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography fontSize={compact ? "0.65rem" : "0.8rem"} color={colors.textSecondary}>
          {label}
        </Typography>
        <Typography fontWeight={700} fontSize={valueFont} color={colors.textPrimary} sx={{ lineHeight: 1.2 }}>
          {value}
        </Typography>
        {trendText && (
          <Box display="flex" alignItems="center" gap={0.4} sx={{ color: trendColor }}>
            <TrendIcon sx={{ fontSize: compact ? 11 : 13 }} />
            <Typography fontSize={compact ? "0.6rem" : "0.72rem"} fontWeight={600} color="inherit">
              {trendText}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function SystemOverviewPanel({
  compact = false,
  plantsOnlinePercent,
  avgResponseTimeLabel,
  co2SavedTons,
}) {
  const padding = compact ? 1.5 : 3;
  const titleFont = compact ? "0.9rem" : "1rem";

  return (
    <Box sx={{ ...glassPanel, p: padding }}>
      <Box display="flex" alignItems="center" gap={0.75} mb={compact ? 1 : 2}>
        <ParkOutlinedIcon sx={{ color: colors.primary, fontSize: compact ? 16 : 20 }} /> // 🚀 colors.brand -> colors.primary
        <Typography variant="h6" fontWeight={700} color={colors.textPrimary} fontSize={titleFont}>
          System Overview
        </Typography>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={compact ? 1 : 3}>
        <Metric
          compact={compact}
          icon={<WbSunnyOutlinedIcon sx={{ fontSize: compact ? 16 : 20 }} />}
          label="Plants Online"
          value={plantsOnlinePercent != null ? `${plantsOnlinePercent}%` : "—"}
          trendText={plantsOnlinePercent != null ? "+2% from last week" : ""}
          trendDirection="up"
        />
        <Metric
          compact={compact}
          icon={<AccessTimeOutlinedIcon sx={{ fontSize: compact ? 16 : 20 }} />}
          label="Average Response Time"
          value={avgResponseTimeLabel || "—"}
          trendText={avgResponseTimeLabel ? "-10% from last week" : ""}
          trendDirection="down"
        />
        <Metric
          compact={compact}
          icon={<Co2OutlinedIcon sx={{ fontSize: compact ? 16 : 20 }} />}
          label="CO₂ Saved"
          value={co2SavedTons != null ? `${co2SavedTons} tons` : "—"}
          trendText={co2SavedTons != null ? "+6% from last week" : ""}
          trendDirection="up"
        />
      </Box>
    </Box>
  );
}