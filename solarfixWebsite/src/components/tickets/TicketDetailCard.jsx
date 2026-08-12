// src/components/tickets/TicketDetailCard.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete, // 🚀 CRUCIAL IMPORT
} from "@mui/material";

import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import ticketAssignmentService from "../../services/ticketAssignmentService";
import ticketUpdateService from "../../services/ticketUpdateService";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const COLORS = {
  primary: "#8FCB84",
  primaryDark: "#6FAE64",
  soft: "#EEF8F0",
  border: "#DCE7DD",
  text: "#27352D",
  muted: "#7B867F",
  warning: "#F5B94C",
  danger: "#F26D6D",
  success: "#76C56B",
  white: "#FFFFFF",
};

const RADIUS = "18px";
const PANEL_PADDING = 2.75;
const SECTION_GAP = 2.75;

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "CRITICAL"];
const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"];

const PRIORITY_STYLES = {
  LOW: { bg: "#EAF7E8", text: COLORS.success },
  MEDIUM: { bg: "#FDF3E2", text: COLORS.warning },
  CRITICAL: { bg: "#FCEBEA", text: COLORS.danger },
};

const STATUS_STYLES = {
  OPEN: { bg: "#EAF7E8", text: COLORS.success },
  ASSIGNED: { bg: "#FDF3E2", text: COLORS.warning },
  IN_PROGRESS: { bg: "#FDF3E2", text: COLORS.warning },
  WAITING_FOR_PARTS: { bg: "#FDF3E2", text: COLORS.warning },
  RESOLVED: { bg: "#EAF7E8", text: COLORS.success },
  CLOSED: { bg: "#EAF7E8", text: COLORS.success },
  CANCELLED: { bg: "#FCEBEA", text: COLORS.danger },
};

function labelSx(extra = {}) {
  return {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    color: COLORS.muted,
    ...extra,
  };
}

function valueSx(extra = {}) {
  return {
    fontSize: "13px",
    fontWeight: 500,
    color: COLORS.text,
    ...extra,
  };
}

function sectionTitleSx(extra = {}) {
  return {
    fontSize: "14px",
    fontWeight: 600,
    color: COLORS.text,
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function timeAgo(dateString) {
  if (!dateString) return "—";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------
function Pill({ bg, text, children }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: 1.25,
        py: 0.4,
        borderRadius: "999px",
        backgroundColor: bg,
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: text }} />
      <Typography sx={{ fontSize: "11px", fontWeight: 700, color: text }}>{children}</Typography>
    </Box>
  );
}

function PillSelect({ value, options, styles, loading, onChange }) {
  const style = styles[value] || Object.values(styles)[0];
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <Select
        value={value}
        disabled={loading}
        onChange={(e) => onChange(e.target.value)}
        variant="standard"
        disableUnderline
        renderValue={(v) => (
          <Pill bg={style.bg} text={style.text}>
            {(v || "").replace(/_/g, " ")}
          </Pill>
        )}
        sx={{
          "& .MuiSelect-select": { py: 0, pr: "24px !important", display: "flex", alignItems: "center" },
          opacity: loading ? 0.6 : 1,
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt} sx={{ fontSize: "12px" }}>
            {opt.replace(/_/g, " ")}
          </MenuItem>
        ))}
      </Select>
      {loading && (
        <CircularProgress
          size={12}
          sx={{ position: "absolute", right: -18, top: "50%", mt: "-6px", color: COLORS.muted }}
        />
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------
function TicketHeader({ priority, isAdmin, loading, onChangePriority }) {
  return (
    <Box
      sx={{
        height: 68,
        px: PANEL_PADDING,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: `linear-gradient(180deg, ${COLORS.soft} 0%, rgba(238,248,240,0.4) 100%)`,
        borderBottom: `1px solid ${COLORS.border}`,
        borderTopLeftRadius: RADIUS,
        borderTopRightRadius: RADIUS,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.primaryDark,
          }}
        >
          <LocalOfferOutlinedIcon sx={{ fontSize: 17 }} />
        </Box>
        <Typography sx={{ fontSize: "20px", fontWeight: 700, color: COLORS.text }}>
          Ticket Details
        </Typography>
      </Stack>

      {isAdmin ? (
        <PillSelect
          value={priority}
          options={PRIORITY_OPTIONS}
          styles={PRIORITY_STYLES}
          loading={loading}
          onChange={onChangePriority}
        />
      ) : (
        <Pill bg={(PRIORITY_STYLES[priority] || PRIORITY_STYLES.MEDIUM).bg} text={(PRIORITY_STYLES[priority] || PRIORITY_STYLES.MEDIUM).text}>
          {priority}
        </Pill>
      )}
    </Box>
  );
}

function InfoRow({ icon, label, value, valueColor, isLast, customValue }) {
  return (
    <Box
      sx={{
        minHeight: 44,
        display: "flex",
        alignItems: "center",
        borderBottom: isLast ? "none" : `1px solid ${COLORS.border}`,
      }}
    >
      <Box sx={{ color: COLORS.muted, display: "flex", alignItems: "center", width: 20 }}>{icon}</Box>
      <Typography sx={labelSx({ ml: 1, minWidth: 78 })}>{label}</Typography>
      <Box sx={{ flex: 1 }} />
      {customValue || (
        <Typography sx={valueSx({ color: valueColor || COLORS.text, textAlign: "right" })}>{value}</Typography>
      )}
    </Box>
  );
}

function TicketInformation({ ticket, currentAssignment, isAdmin, statusLoading, onChangeStatus }) {
  const priorityStyle = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.MEDIUM;

  const leftRows = [
    { icon: <TagOutlinedIcon sx={{ fontSize: 16 }} />, label: "Ticket ID", value: `#${ticket.ticketId}` },
    {
      icon: <AssignmentOutlinedIcon sx={{ fontSize: 16 }} />,
      label: "Status",
      customValue: isAdmin ? (
        <PillSelect
          value={ticket.status}
          options={STATUS_OPTIONS}
          styles={STATUS_STYLES}
          loading={statusLoading}
          onChange={onChangeStatus}
        />
      ) : (
        <Pill bg={(STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN).bg} text={(STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN).text}>
          {(ticket.status || "").replace(/_/g, " ")}
        </Pill>
      ),
    },
    { icon: <FlagOutlinedIcon sx={{ fontSize: 16 }} />, label: "Priority", value: ticket.priority, valueColor: priorityStyle.text },
    { icon: <GridViewOutlinedIcon sx={{ fontSize: 16 }} />, label: "Category", value: ticket.category || "—" },
    { icon: <SensorsOutlinedIcon sx={{ fontSize: 16 }} />, label: "Source", value: ticket.source || "—" },
  ];

  const rightRows = [
    { icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />, label: "Created", value: formatDate(ticket.createdAt) },
    { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />, label: "Updated", value: timeAgo(ticket.updatedAt) },
    { icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />, label: "Assigned To", value: currentAssignment?.technician ? `${currentAssignment.technician.firstName} ${currentAssignment.technician.lastName}` : "—" },
    { icon: <AssignmentIndOutlinedIcon sx={{ fontSize: 16 }} />, label: "Assignment Status", value: currentAssignment ? (currentAssignment.status === "PENDING" ? "Pending Approval" : currentAssignment.status) : "—" },
    { icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />, label: "Assigned On", value: currentAssignment?.assignedAt ? formatDate(currentAssignment.assignedAt) : "—" },
  ];

  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS,
        px: PANEL_PADDING,
        display: "flex",
        gap: 3,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ flex: "1 1 220px" }}>
        {leftRows.map((row, i) => (
          <InfoRow key={row.label} {...row} isLast={i === leftRows.length - 1} />
        ))}
      </Box>
      <Box sx={{ flex: "1 1 220px" }}>
        {rightRows.map((row, i) => (
          <InfoRow key={row.label} {...row} isLast={i === rightRows.length - 1} />
        ))}
      </Box>
    </Box>
  );
}

function TitleSection({ title }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography sx={sectionTitleSx()}>Title</Typography>
        <IconButton size="small" sx={{ border: `1px solid ${COLORS.border}`, borderRadius: "8px", p: 0.5 }}>
          <MoreVertIcon sx={{ fontSize: 16, color: COLORS.muted }} />
        </IconButton>
      </Stack>
      <Divider sx={{ borderColor: COLORS.border, mb: 1.25 }} />
      <Typography sx={valueSx({ fontSize: "14px", fontWeight: 600 })}>{title}</Typography>
    </Box>
  );
}

function DescriptionSection({ description }) {
  return (
    <Box>
      <Typography sx={sectionTitleSx({ mb: 1 })}>Description</Typography>
      <Divider sx={{ borderColor: COLORS.border, mb: 1.25 }} />
      <Typography sx={valueSx({ lineHeight: 1.6 })}>{description}</Typography>
    </Box>
  );
}

function AssignmentCard({ currentAssignment, technicians, isAdmin, approveLoading, reassignLoading, onApprove, onReassign, onAssign }) {
  const [reassigning, setReassigning] = useState(false);
  const [technicianId, setTechnicianId] = useState("");

  const technicianName = currentAssignment?.technician
    ? `${currentAssignment.technician.firstName} ${currentAssignment.technician.lastName}`
    : "—";
  const statusLabel = currentAssignment
    ? currentAssignment.status === "PENDING"
      ? "Pending Approval"
      : currentAssignment.status
    : "—";
  const assignedOn = currentAssignment?.assignedAt ? formatDate(currentAssignment.assignedAt) : "—";
  const canAct = isAdmin && currentAssignment?.status === "PENDING";
  const canAssign = isAdmin && !currentAssignment;

  const confirmReassign = () => {
    if (!technicianId) return;
    onReassign(technicianId);
    setTechnicianId("");
    setReassigning(false);
  };

  return (
    <Box
      sx={{
        borderRadius: RADIUS,
        border: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.soft,
        p: PANEL_PADDING,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} mb={1.5}>
        <PersonOutlineOutlinedIcon sx={{ fontSize: 16, color: COLORS.primaryDark }} />
        <Typography sx={sectionTitleSx()}>Assignment</Typography>
      </Stack>

      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
        <Stack spacing={0.75} sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center">
            <Typography sx={labelSx({ minWidth: 130, textTransform: "none", fontSize: "12px" })}>Technician</Typography>
            <Typography sx={valueSx()}>: {technicianName}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={labelSx({ minWidth: 130, textTransform: "none", fontSize: "12px" })}>Assignment Status</Typography>
            <Typography sx={valueSx({ color: currentAssignment?.status === "PENDING" ? COLORS.warning : COLORS.text })}>: {statusLabel}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={labelSx({ minWidth: 130, textTransform: "none", fontSize: "12px" })}>Assigned On</Typography>
            <Typography sx={valueSx()}>: {assignedOn}</Typography>
          </Stack>

          {/* SCÉNARIO 1 : Réassignation (si une assignation PENDING existe) */}
          {reassigning && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Select
                size="small"
                displayEmpty
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                sx={{ fontSize: "12px", height: 32, minWidth: 140, backgroundColor: COLORS.white, borderRadius: "8px" }}
              >
                <MenuItem value="" disabled sx={{ fontSize: "12px" }}>Choose technician…</MenuItem>
                {technicians.map((tech) => (
                  <MenuItem key={tech.id} value={tech.id} sx={{ fontSize: "12px" }}>
                    {tech.firstName} {tech.lastName}
                  </MenuItem>
                ))}
              </Select>
              {technicianId && (
                <Button
                  size="small"
                  disabled={reassignLoading}
                  onClick={confirmReassign}
                  sx={{
                    height: 32, fontSize: "12px", textTransform: "none", borderRadius: "8px", fontWeight: 600,
                    backgroundColor: COLORS.primary, color: COLORS.white,
                    "&:hover": { backgroundColor: COLORS.primaryDark },
                  }}
                >
                  {reassignLoading ? <CircularProgress size={14} sx={{ color: COLORS.white }} /> : "Confirm"}
                </Button>
              )}
            </Stack>
          )}
        </Stack>

        {/* ACTIONS DU CÔTÉ DROIT */}
        {canAct && (
          <Stack spacing={1}>
            <Button
              onClick={onApprove}
              disabled={approveLoading}
              startIcon={approveLoading ? <CircularProgress size={14} sx={{ color: COLORS.white }} /> : <CheckIcon sx={{ fontSize: 15 }} />}
              sx={{
                height: 36, fontSize: "12px", fontWeight: 600, textTransform: "none", borderRadius: "10px",
                backgroundColor: COLORS.primary, color: COLORS.white, px: 2,
                "&:hover": { backgroundColor: COLORS.primaryDark },
              }}
            >
              Approve
            </Button>
            <Button
              onClick={() => setReassigning((v) => !v)}
              startIcon={<PersonOutlineOutlinedIcon sx={{ fontSize: 15 }} />}
              variant="outlined"
              sx={{
                height: 36, fontSize: "12px", fontWeight: 600, textTransform: "none", borderRadius: "10px",
                borderColor: COLORS.primary, color: COLORS.primaryDark, px: 2,
                "&:hover": { borderColor: COLORS.primaryDark, backgroundColor: "rgba(143,203,132,0.08)" },
              }}
            >
              Reassign
            </Button>
          </Stack>
        )}

        {/* 🚀 SCÉNARIO 2 : Assignation initiale (Si le ticket est VIDE) */}
        {canAssign && (
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ fontSize: "12px", color: COLORS.muted, mb: 1 }}>No technician assigned yet.</Typography>
            <Autocomplete
              size="small"
              options={technicians}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.regionOfResponsibility || 'No region'})`}
              onChange={(event, newValue) => {
                if (newValue) {
                  onAssign(newValue.id);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search & Assign..."
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              )}
              sx={{ width: '100%' }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

function TicketActions({ status, isAdmin, approveResolutionLoading, rejectLoading, onApproveResolution, onOpenReject }) {
  if (!isAdmin) return null;

  const showApproveResolution = status === "RESOLVED";
  const showReject = status !== "CLOSED" && status !== "CANCELLED";

  if (!showApproveResolution && !showReject) return null;

  return (
    <Stack direction="row" spacing={1.25}>
      {showApproveResolution && (
        <Button
          onClick={onApproveResolution}
          disabled={approveResolutionLoading}
          startIcon={approveResolutionLoading ? <CircularProgress size={14} sx={{ color: COLORS.white }} /> : <CheckIcon sx={{ fontSize: 15 }} />}
          sx={{
            height: 36, fontSize: "12px", fontWeight: 600, textTransform: "none", borderRadius: "10px",
            backgroundColor: COLORS.primary, color: COLORS.white, px: 2,
            "&:hover": { backgroundColor: COLORS.primaryDark },
          }}
        >
          Approve Resolution
        </Button>
      )}
      {showReject && (
        <Button
          onClick={onOpenReject}
          disabled={rejectLoading}
          startIcon={rejectLoading ? <CircularProgress size={14} sx={{ color: COLORS.danger }} /> : <CloseIcon sx={{ fontSize: 15 }} />}
          variant="outlined"
          sx={{
            height: 36, fontSize: "12px", fontWeight: 600, textTransform: "none", borderRadius: "10px",
            borderColor: COLORS.danger, color: COLORS.danger, px: 2,
            "&:hover": { borderColor: COLORS.danger, backgroundColor: "rgba(242,109,109,0.06)" },
          }}
        >
          Reject
        </Button>
      )}
    </Stack>
  );
}

function RejectDialog({ open, reason, loading, onChangeReason, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle sx={{ fontSize: "16px", fontWeight: 700, color: COLORS.text }}>Reject ticket</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "13px", color: COLORS.muted, mb: 1.5 }}>
          Please explain why this ticket is being rejected.
        </Typography>
        <TextField
          autoFocus
          multiline
          minRows={3}
          fullWidth
          placeholder="Reason..."
          value={reason}
          onChange={(e) => onChangeReason(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "13px" } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onCancel} sx={{ textTransform: "none", fontSize: "12px", color: COLORS.muted }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading || !reason.trim()}
          sx={{
            textTransform: "none", fontSize: "12px", fontWeight: 600, borderRadius: "8px", px: 2,
            backgroundColor: COLORS.danger, color: COLORS.white,
            "&:hover": { backgroundColor: "#D95555" },
          }}
        >
          {loading ? <CircularProgress size={14} sx={{ color: COLORS.white }} /> : "Confirm rejection"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AddNote({ value, onChange, onSubmit, loading }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={0.75} mb={1}>
        <StickyNote2OutlinedIcon sx={{ fontSize: 16, color: COLORS.primaryDark }} />
        <Typography sx={sectionTitleSx()}>Add Note</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          placeholder="Type your note here..."
          size="small"
          fullWidth
          value={value}
          disabled={loading}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              borderRadius: "12px",
              fontSize: "13px",
              "& fieldset": { borderColor: COLORS.border },
              "&:hover fieldset": { borderColor: COLORS.primary },
            },
          }}
        />
        <IconButton
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            "&:hover": { backgroundColor: COLORS.primaryDark },
            "&.Mui-disabled": { backgroundColor: COLORS.border, color: COLORS.muted },
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : <SendIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Stack>
    </Box>
  );
}

function ActivityTimeline({ loading, entries }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.25}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: COLORS.primaryDark }} />
          <Typography sx={sectionTitleSx()}>Activity Timeline</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.25} sx={{ cursor: "pointer" }}>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: COLORS.primaryDark }}>View all</Typography>
          <Typography sx={{ fontSize: "12px", color: COLORS.primaryDark }}>{">"}</Typography>
        </Stack>
      </Stack>
      <Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={18} sx={{ color: COLORS.muted }} />
          </Box>
        ) : entries.length === 0 ? (
          <Typography sx={{ fontSize: "12px", color: COLORS.muted }}>No activity yet.</Typography>
        ) : (
          entries.map((entry, i) => (
            <ActivityEntry key={entry.updateId ?? i} {...entry} isLast={i === entries.length - 1} />
          ))
        )}
      </Box>
    </Box>
  );
}

function iconForEntry(entry) {
  if (entry.previousStatus === entry.newStatus) {
    return <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14 }} />;
  }
  return <AutorenewOutlinedIcon sx={{ fontSize: 14 }} />;
}

function ActivityEntry({ icon, title, subtitle, time, date, isLast }) {
  return (
    <Box sx={{ display: "flex", gap: 1.25, minHeight: 54 }}>
      <Stack alignItems="center" sx={{ pt: 0.5 }}>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "8px",
            backgroundColor: COLORS.soft,
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.primaryDark,
          }}
        >
          {icon}
        </Box>
        {!isLast && <Box sx={{ width: "1px", flex: 1, backgroundColor: COLORS.border, mt: 0.5 }} />}
      </Stack>
      <Box sx={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", pb: 1.5 }}>
        <Box>
          <Typography sx={valueSx({ fontWeight: 600 })}>{title}</Typography>
          <Typography sx={{ fontSize: "11px", color: COLORS.muted, mt: 0.2 }}>{subtitle}</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: "11px", color: COLORS.muted, lineHeight: 1.4 }}>{time}</Typography>
          <Typography sx={{ fontSize: "11px", color: COLORS.muted, lineHeight: 1.4 }}>{date}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function TicketDetailCard({
  ticket,
  technicians = [],
  onChanged,
  onToast,
  height = 460,
  role = "ADMIN",
}) {
  const isAdmin = role === "ADMIN";

  const [localTicket, setLocalTicket] = useState(ticket);
  useEffect(() => setLocalTicket(ticket), [ticket]);

  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [noteText, setNoteText] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [loading, setLoading] = useState({
    priority: false,
    status: false,
    approve: false,
    reassign: false,
    approveResolution: false,
    reject: false,
    comment: false,
  });
  const setBusy = (key, val) => setLoading((prev) => ({ ...prev, [key]: val }));

  const notify = useCallback((toast) => onToast && onToast(toast), [onToast]);

  const loadHistory = useCallback(async (ticketId) => {
    setHistoryLoading(true);
    try {
      const res = await ticketUpdateService.getHistory(ticketId);
      const entries = (res.data || [])
        .slice()
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .map((u) => ({
          updateId: u.updateId,
          icon: iconForEntry(u),
          previousStatus: u.previousStatus,
          newStatus: u.newStatus,
          title: u.updateDescription || `Status: ${u.previousStatus} → ${u.newStatus}`,
          subtitle: `by ${u.updatedBy?.username || u.updatedBy?.firstName || "Admin"}`,
          time: formatTime(u.updatedAt),
          date: formatDate(u.updatedAt),
        }));
      setHistory(entries);
    } catch (error) {
      console.error("History loading error:", error);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    setNoteText("");
    setRejectOpen(false);
    setRejectReason("");
    if (ticket?.ticketId) {
      // 🚀 Utilisation directe des assignations du ticket
      const ticketAssignments = ticket.assignments || [];
      setAssignments(ticketAssignments);
      console.log("📦 [TicketDetailCard] Assignations reçues :", ticketAssignments);
      loadHistory(ticket.ticketId);
    } else {
      setAssignments([]);
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.ticketId]);

  const currentAssignment = assignments.length > 0
    ? [...assignments].sort((a, b) => b.assignmentId - a.assignmentId)[0]
    : null;

  console.log("🔍 [TicketDetailCard] Assignation actuelle :", currentAssignment);

  const refreshAfterAction = async () => {
    await loadHistory(localTicket.ticketId);
    onChanged && onChanged();
  };

  // --- Priority -------------------------------------------------------
  const handleChangePriority = async (newPriority) => {
    if (!isAdmin || newPriority === localTicket.priority) return;
    setBusy("priority", true);
    try {
      await ticketUpdateService.changePriority(localTicket.ticketId, newPriority);
      setLocalTicket((t) => ({ ...t, priority: newPriority }));
      notify({ type: "success", message: `Priority changed to ${newPriority}` });
      await refreshAfterAction();
    } catch (error) {
      console.error("Change priority error:", error);
      notify({ type: "error", message: "Could not change priority." });
    } finally {
      setBusy("priority", false);
    }
  };

  // --- Status -----------------------------------------------------------
  const handleChangeStatus = async (newStatus) => {
    if (!isAdmin || newStatus === localTicket.status) return;
    setBusy("status", true);
    try {
      await ticketUpdateService.changeStatus(localTicket.ticketId, newStatus);
      setLocalTicket((t) => ({ ...t, status: newStatus }));
      notify({ type: "success", message: `Status changed to ${newStatus.replace(/_/g, " ")}` });
      await refreshAfterAction();
    } catch (error) {
      console.error("Change status error:", error);
      notify({ type: "error", message: "Could not change status." });
    } finally {
      setBusy("status", false);
    }
  };

  // --- Approve resolution -------------------------------------------------
  const handleApproveResolution = async () => {
    if (!isAdmin) return;
    setBusy("approveResolution", true);
    try {
      await ticketUpdateService.approveResolution(localTicket.ticketId);
      setLocalTicket((t) => ({ ...t, status: "RESOLVED" }));
      notify({ type: "success", message: "Resolution approved" });
      await refreshAfterAction();
    } catch (error) {
      console.error("Approve resolution error:", error);
      notify({ type: "error", message: "Could not approve resolution." });
    } finally {
      setBusy("approveResolution", false);
    }
  };

  // --- Reject -------------------------------------------------------------
  const handleConfirmReject = async () => {
    if (!isAdmin || !rejectReason.trim()) return;
    setBusy("reject", true);
    try {
      await ticketUpdateService.rejectTicket(localTicket.ticketId, rejectReason.trim());
      setLocalTicket((t) => ({ ...t, status: "CANCELLED" }));
      notify({ type: "success", message: "Ticket rejected" });
      setRejectOpen(false);
      setRejectReason("");
      await refreshAfterAction();
    } catch (error) {
      console.error("Reject ticket error:", error);
      notify({ type: "error", message: "Could not reject ticket." });
    } finally {
      setBusy("reject", false);
    }
  };

  // --- Assignment: approve / reassign ------------------------------------
  const handleApprove = async () => {
    if (!isAdmin || !currentAssignment) return;
    setBusy("approve", true);
    try {
      await ticketAssignmentService.approve(currentAssignment.assignmentId);
      notify({ type: "success", message: "Assignment approved" });
      await refreshAfterAction();
    } catch (error) {
      console.error("Approve error:", error);
      notify({ type: "error", message: "Could not approve assignment." });
    } finally {
      setBusy("approve", false);
    }
  };

  const handleReassign = async (technicianId) => {
    if (!isAdmin || !currentAssignment || !technicianId) return;
    setBusy("reassign", true);
    try {
      await ticketAssignmentService.refuseAndReassign(currentAssignment.assignmentId, technicianId);
      notify({ type: "success", message: "Ticket reassigned" });
      await refreshAfterAction();
    } catch (error) {
      console.error("Reassign error:", error);
      notify({ type: "error", message: "Could not reassign ticket." });
    } finally {
      setBusy("reassign", false);
    }
  };

  // 🚀 NOUVEAU HANDLER : Assigner un technicien à un ticket vide
  const handleAssign = async (technicianId) => {
    if (!isAdmin || !technicianId) return;
    setBusy("reassign", true);
    try {
      await ticketUpdateService.assignTechnician(localTicket.ticketId, technicianId);
      notify({ type: "success", message: "Technician assigned!" });
      await refreshAfterAction();
    } catch (error) {
      console.error("Assign error:", error);
      notify({ type: "error", message: "Could not assign technician." });
    } finally {
      setBusy("reassign", false);
    }
  };

  // --- Add comment --------------------------------------------------------
  const handleAddComment = async () => {
    if (!noteText.trim() || !localTicket) return;
    const text = noteText.trim();
    setBusy("comment", true);
    try {
      await ticketUpdateService.addComment(localTicket.ticketId, text);
      setNoteText("");
      notify({ type: "success", message: "Note added" });
      await loadHistory(localTicket.ticketId);
      onChanged && onChanged();
    } catch (error) {
      console.error("Add comment error:", error);
      notify({ type: "error", message: "Could not add note." });
    } finally {
      setBusy("comment", false);
    }
  };

  if (!localTicket) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS,
        }}
      >
        <Typography sx={{ fontSize: "13px", color: COLORS.muted }}>Select a ticket to see details.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height,
        overflowY: "auto",
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS,
        backgroundColor: COLORS.white,
        boxShadow: "0 1px 3px rgba(39,53,45,0.04)",
      }}
    >
      <TicketHeader
        priority={localTicket.priority}
        isAdmin={isAdmin}
        loading={loading.priority}
        onChangePriority={handleChangePriority}
      />

      <Stack spacing={SECTION_GAP} sx={{ p: PANEL_PADDING }}>
        <TicketInformation
          ticket={localTicket}
          currentAssignment={currentAssignment}
          isAdmin={isAdmin}
          statusLoading={loading.status}
          onChangeStatus={handleChangeStatus}
        />

        <TitleSection title={localTicket.title} />
        <DescriptionSection description={localTicket.description} />

        <AssignmentCard
          currentAssignment={currentAssignment}
          technicians={technicians}
          isAdmin={isAdmin}
          approveLoading={loading.approve}
          reassignLoading={loading.reassign}
          onApprove={handleApprove}
          onReassign={handleReassign}
          onAssign={handleAssign} // 🚀 PROP AJOUTÉE ICI
        />

        <TicketActions
          status={localTicket.status}
          isAdmin={isAdmin}
          approveResolutionLoading={loading.approveResolution}
          rejectLoading={loading.reject}
          onApproveResolution={handleApproveResolution}
          onOpenReject={() => setRejectOpen(true)}
        />

        <AddNote value={noteText} onChange={setNoteText} onSubmit={handleAddComment} loading={loading.comment} />

        <ActivityTimeline loading={historyLoading} entries={history} />
      </Stack>

      <RejectDialog
        open={rejectOpen}
        reason={rejectReason}
        loading={loading.reject}
        onChangeReason={setRejectReason}
        onCancel={() => {
          setRejectOpen(false);
          setRejectReason("");
        }}
        onConfirm={handleConfirmReject}
      />
    </Box>
  );
}