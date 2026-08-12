// src/components/dashboard/PendingAssignmentsList.jsx

import React from "react";
import { Box, Typography, Button } from "@mui/material";

import ConfirmationNumberOutlinedIcon from
  "@mui/icons-material/ConfirmationNumberOutlined";

import { useNavigate } from "react-router-dom";
import { colors } from "../../theme";

function timeAgo(dateString) {
  if (!dateString) return "";

  const diffMs =
    Date.now() -
    new Date(dateString).getTime();

  const minutes = Math.round(
    diffMs / 60000
  );

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.round(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h`;
  }

  return `${Math.round(hours / 24)}d`;
}

export default function PendingAssignmentsList({
  compact = false,
  tickets = [],
}) {
  const navigate = useNavigate();

  const pending = tickets
    .filter(
      (t) =>
        t.status !== "RESOLVED" &&
        t.assignments &&
        t.assignments.length > 0 &&
        t.assignments[0].status === "PENDING"
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, compact ? 3 : 4);

  if (pending.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          color={colors.textMuted}
          fontSize="0.7rem"
        >
          All caught up.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: compact ? "6px" : "10px",
      }}
    >
      {pending.map((ticket) => (
        <Box
          key={ticket.ticketId}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,

            minHeight: compact ? 40 : 48,

            px: 0.8,
            py: 0.5,

            borderRadius: "8px",

            backgroundColor:
              "#FAFCFB",

            border:
              "1px solid #EEF2EF",
          }}
        >
          <Box
            sx={{
              width: 25,
              height: 25,

              borderRadius: "7px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor:
                colors.primaryTint,

              flexShrink: 0,
            }}
          >
            <ConfirmationNumberOutlinedIcon
              sx={{
                fontSize: 13,
                color: colors.primary,
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              fontWeight={600}
              fontSize="0.68rem"
              color={colors.textPrimary}
              noWrap
            >
              {ticket.title}
            </Typography>

            <Typography
              fontSize="0.57rem"
              color={colors.textMuted}
            >
              {timeAgo(ticket.createdAt)} ago
            </Typography>
          </Box>

          <Button
            size="small"
            onClick={() =>
              navigate(
                `/tickets/${ticket.ticketId}`
              )
            }
            sx={{
              minWidth: "auto",

              px: 0.8,
              py: 0.25,

              fontSize: "0.6rem",

              textTransform: "none",

              color: colors.primary,

              fontWeight: 700,

              borderRadius: "6px",

              "&:hover": {
                backgroundColor:
                  colors.primaryTint,
              },
            }}
          >
            View
          </Button>
        </Box>
      ))}
    </Box>
  );
}