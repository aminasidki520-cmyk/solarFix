import React from "react";
import { Card, Box, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { colors } from "../../theme";

export default function TicketSummaryCard({
  title,
  value,
  icon,
  variant = "soft",
  tone = colors.brandSoft,
  toneColor = colors.brand,
  trendText,
}) {
  const isFilled = variant === "filled";

  return (
    <Card
      elevation={0}
      sx={{
        flex: "1 1 180px",
        minWidth: 180,
        p: 1.75,
        borderRadius: "14px",
        backgroundColor: isFilled ? colors.brand : tone,
        border: isFilled ? "none" : `1px solid ${colors.border}`,
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isFilled ? "rgba(255,255,255,0.16)" : colors.surface,
          color: isFilled ? "#FFFFFF" : toneColor,
          mb: 1,
        }}
      >
        {icon}
      </Box>

      <Typography
        fontWeight={600}
        color={isFilled ? "#FFFFFF" : colors.textSecondary}
        fontSize="0.76rem"
        mb={0.25}
      >
        {title}
      </Typography>

      <Typography
        fontWeight={700}
        fontSize="1.4rem"
        color={isFilled ? "#FFFFFF" : colors.textPrimary}
        sx={{ mb: 0.5, letterSpacing: "-0.02em" }}
      >
        {value}
      </Typography>

      {trendText && (
        <Box display="flex" alignItems="center" gap={0.5} sx={{ color: isFilled ? "rgba(255,255,255,0.85)" : colors.success }}>
          <ArrowUpwardIcon sx={{ fontSize: 11 }} />
          <Typography fontWeight={600} fontSize="0.68rem" color="inherit">
            {trendText}
          </Typography>
        </Box>
      )}
    </Card>
  );
}