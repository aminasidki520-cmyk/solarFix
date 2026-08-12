// src/pages/Tickets/CreateTicketPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, TextField, Select, MenuItem, Button, IconButton, Snackbar, Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";

import ticketService from "../../services/ticketService";
import anomalyService from "../../services/anomalyService";
import { colors, glassPanel } from "../../theme";

const PRIORITIES = ["LOW", "MEDIUM", "CRITICAL"];
const STATUSES = ["OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_PARTS", "RESOLVED", "CLOSED", "CANCELLED"];

const SEVERITY_TO_PRIORITY = { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "CRITICAL" };

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "",
  status: "OPEN",
  anomalyId: "",
  dueDate: "",
  additionalNotes: "",
};

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedAnomalyId = searchParams.get("anomalyId");

  const [form, setForm] = useState(EMPTY_FORM);
  const [anomalies, setAnomalies] = useState([]);
  const [availableAnomalyIds, setAvailableAnomalyIds] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadAnomalies();
  }, []);

  useEffect(() => {
    if (preselectedAnomalyId) {
      setForm((f) => ({ ...f, anomalyId: preselectedAnomalyId }));
    }
  }, [preselectedAnomalyId]);

     const loadAnomalies = async () => {
    try {
      const [anomalyRes, ticketRes] = await Promise.allSettled([
        anomalyService.getAll(),
        ticketService.getAll(),
      ]);
      
      const anomalyData = anomalyRes.status === "fulfilled" ? anomalyRes.value : [];
      const ticketData = ticketRes.status === "fulfilled" ? ticketRes.value : [];
      
      const anomalyList = Array.isArray(anomalyData) ? anomalyData : anomalyData?.content || [];
      const ticketList = Array.isArray(ticketData) ? ticketData : ticketData?.content || [];

      console.log("✅ Anomalies chargées :", anomalyList);

      // 🚀 FILTRE RÉACTIVÉ ! On ne garde que les anomalies qui n'ont PAS de ticket
      const ticketedIds = new Set(
        ticketList.map((t) => t.anomaly?.AnomalyId).filter((id) => id != null)
      );

      setAvailableAnomalyIds(
        new Set(anomalyList.filter((a) => !ticketedIds.has(a.AnomalyId)).map((a) => a.AnomalyId))
      );

      setAnomalies(anomalyList);
    } catch (error) {
      console.error("Anomalies loading error:", error);
    }
  };

  const availableAnomalies = useMemo(
    // On filtre les anomalies selon le Set des IDs disponibles
    () => anomalies.filter((a) => availableAnomalyIds.has(a.AnomalyId)),
    [anomalies, availableAnomalyIds]
  );

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAnomalyChange = (e) => {
    const anomalyId = e.target.value;
    const anomaly = anomalies.find((a) => a.AnomalyId === anomalyId);
    setForm((f) => ({
      ...f,
      anomalyId,
      title: f.title || (anomaly ? `Anomaly detected - ${anomaly.AnomalyType}` : f.title),
      priority: f.priority || (anomaly ? SEVERITY_TO_PRIORITY[anomaly.severity] : f.priority),
      description:
        f.description ||
        (anomaly ? `Manual ticket created for anomaly in region: ${anomaly.region || "unknown"}.` : f.description),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.priority || !form.anomalyId) {
      setToast({ type: "error", message: "Please fill in Title, Description, Priority and Related Anomaly." });
      return;
    }
    setSubmitting(true);
    try {
      await ticketService.create({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        anomalyId: form.anomalyId,
        dueDate: form.dueDate || null,
        additionalNotes: form.additionalNotes || null,
      });
      setToast({ type: "success", message: "Ticket created successfully." });
      setTimeout(() => navigate("/tickets"), 800);
    } catch (error) {
      console.error("Create ticket error:", error);
      setToast({ type: "error", message: "Could not create ticket." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box display="flex" alignItems="center" gap={1.5}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={800} color={colors.textPrimary} letterSpacing="-0.01em">
            Create Ticket
          </Typography>
          <Typography color={colors.textSecondary} fontSize="0.9rem">
            Create a new maintenance ticket to track and resolve issues.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 2.5, alignItems: "start" }}>
        <Box sx={{ ...glassPanel, p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2.5}>
            <DescriptionOutlinedIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography fontWeight={700} fontSize="1rem" color={colors.textPrimary}>Ticket Details</Typography>
          </Box>

          <FieldLabel>Title *</FieldLabel>
          <TextField fullWidth size="small" placeholder="Enter a clear and descriptive title" value={form.title} onChange={update("title")} sx={{ mb: 2.5 }} />

          <FieldLabel>Description *</FieldLabel>
          <TextField
            fullWidth multiline rows={4} placeholder="Describe the issue in detail"
            value={form.description}
            onChange={(e) => e.target.value.length <= 500 && update("description")(e)}
            sx={{ mb: 0.5 }}
          />
          <Typography fontSize="0.72rem" color={colors.textMuted} textAlign="right" mb={2.5}>
            {form.description.length}/500
          </Typography>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2.5}>
            <Box>
              <FieldLabel>Priority *</FieldLabel>
              <Select fullWidth size="small" displayEmpty value={form.priority} onChange={update("priority")}>
                <MenuItem value="" disabled>Select priority</MenuItem>
                {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </Box>
            <Box>
              <FieldLabel>Status</FieldLabel>
              <Select fullWidth size="small" value={form.status} onChange={update("status")}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace(/_/g, " ")}</MenuItem>)}
              </Select>
            </Box>
          </Box>

          <FieldLabel>Related Anomaly *</FieldLabel>
          <Select fullWidth size="small" displayEmpty value={form.anomalyId} onChange={handleAnomalyChange} sx={{ mb: 2.5 }}>
            <MenuItem value="" disabled>Select anomaly</MenuItem>
            {availableAnomalies.map((a) => (
              <MenuItem key={a.AnomalyId} value={a.AnomalyId}>
                {a.AnomalyType?.replace(/_/g, " ")} — {a.severity} ({a.region || "no region"})
              </MenuItem>
            ))}
          </Select>

          <FieldLabel>Due Date</FieldLabel>
          <TextField fullWidth size="small" type="datetime-local" value={form.dueDate} onChange={update("dueDate")} sx={{ mb: 2.5 }} />

          <FieldLabel>Additional Notes (Optional)</FieldLabel>
          <TextField
            fullWidth multiline rows={3} placeholder="Add any additional information..."
            value={form.additionalNotes}
            onChange={(e) => e.target.value.length <= 300 && update("additionalNotes")(e)}
          />
          <Typography fontSize="0.72rem" color={colors.textMuted} textAlign="right">
            {form.additionalNotes.length}/300
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2.5}>
          <Box sx={{ ...glassPanel, p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Inventory2OutlinedIcon sx={{ color: colors.primary, fontSize: 20 }} />
              <Typography fontWeight={700} fontSize="1rem" color={colors.textPrimary}>Ticket Preview</Typography>
            </Box>
            <Box sx={{ border: `1px dashed ${colors.border}`, borderRadius: "12px", p: 3, textAlign: "center" }}>
              {form.title ? (
                <>
                  <Typography fontWeight={700} color={colors.textPrimary} mb={0.5}>{form.title}</Typography>
                  <Typography fontSize="0.8rem" color={colors.textSecondary}>{form.description || "—"}</Typography>
                </>
              ) : (
                <Typography fontSize="0.85rem" color={colors.textMuted}>This is a preview of your ticket details</Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ ...glassPanel, p: 3 }}>
            <Typography fontWeight={700} fontSize="1rem" color={colors.textPrimary} mb={2}>Quick Actions</Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <QuickAction icon={<DeleteIcon fontSize="small" />} label="Clear Form" onClick={() => setForm(EMPTY_FORM)} />
              <QuickAction icon={<VisibilityOutlinedIcon fontSize="small" />} label="View Tickets" onClick={() => navigate("/tickets")} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ ...glassPanel, p: 2, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button variant="outlined" onClick={() => navigate("/tickets")} sx={{ borderColor: colors.border, color: colors.textPrimary, textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button variant="contained" disableElevation disabled={submitting} onClick={handleSubmit} sx={{ bgcolor: colors.primary, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: colors.primaryDark } }}>
          {submitting ? "Creating..." : "Create Ticket"}
        </Button>
      </Box>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast && <Alert severity={toast.type} onClose={() => setToast(null)}>{toast.message}</Alert>}
      </Snackbar>
    </Box>
  );
}

function FieldLabel({ children }) {
  return <Typography fontSize="0.82rem" fontWeight={600} color={colors.textPrimary} mb={0.75}>{children}</Typography>;
}

function QuickAction({ icon, label, onClick }) {
  return (
    <Box onClick={onClick} sx={{ display: "flex", alignItems: "center", gap: 1.2, p: 1.2, borderRadius: "10px", backgroundColor: colors.primaryTint, cursor: "pointer", "&:hover": { backgroundColor: colors.border } }}>
      <Box sx={{ color: colors.primary, display: "flex" }}>{icon}</Box>
      <Typography fontSize="0.85rem" fontWeight={600} color={colors.textPrimary}>{label}</Typography>
    </Box>
  );
}