import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Button, Tabs, Tab, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, CircularProgress, TablePagination,
  Snackbar, Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";

import TicketSummaryCard from "../../components/tickets/TicketSummaryCard";
import TicketDetailCard from "../../components/tickets/TicketDetailCard";
import ticketService from "../../services/ticketService";
import technicianService from "../../services/technicianService";
import { colors, glassPanel } from "../../theme";

const PANEL_HEIGHT = 460;

// 🚀 FIX DES COULEURS : Utilisation des couleurs existantes dans theme.js
const PRIORITY_COLORS = {
  LOW: { bg: colors.successLight, text: colors.success },
  MEDIUM: { bg: colors.warningLight, text: colors.warning },
  HIGH: { bg: colors.dangerLight, text: colors.danger },
  CRITICAL: { bg: colors.dangerLight, text: colors.danger },
};

const STATUS_COLORS = {
  OPEN: { bg: colors.infoLight, text: colors.info },
  ASSIGNED: { bg: colors.infoLight, text: colors.info },
  IN_PROGRESS: { bg: colors.warningLight, text: colors.warning },
  WAITING_FOR_PARTS: { bg: colors.warningLight, text: colors.warning },
  RESOLVED: { bg: colors.successLight, text: colors.success },
  CLOSED: { bg: colors.successLight, text: colors.success },
  CANCELLED: { bg: colors.dangerLight, text: colors.danger },
};

const ALL_STATUSES = ["OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_PARTS", "RESOLVED", "CLOSED", "CANCELLED"];

const TABS = [
  { key: "ALL", label: "All" },
  { key: "OPEN", label: "Open" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Resolved" },
  { key: "CLOSED", label: "Closed" },
];

function timeAgo(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function TicketsPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const [ticketRes, techRes] = await Promise.allSettled([
        ticketService.getAll(),
        technicianService.getAll(),
      ]);
      
      // 🚀 FIX CRITIQUE ICI : on retire '.data' car ticketRes.value est déjà le tableau !
      const ticketData = ticketRes.status === "fulfilled" ? ticketRes.value : [];
      const techData = techRes.status === "fulfilled" ? techRes.value : [];
      
      const ticketList = Array.isArray(ticketData) ? ticketData : ticketData?.content || [];
      const techList = Array.isArray(techData) ? techData : techData?.content || [];

      setTickets(ticketList);
      setTechnicians(techList);
      
      // Sélectionne automatiquement le premier ticket si la liste est remplie
      if (ticketList.length > 0 && !selectedId) setSelectedId(ticketList[0].ticketId);
    } catch (error) {
      console.error("Tickets loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => {
    const c = { ALL: tickets.length };
    ALL_STATUSES.forEach((s) => { c[s] = tickets.filter((t) => t.status === s).length; });
    return c;
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (activeTab === "ALL") return tickets;
    return tickets.filter((t) => t.status === activeTab);
  }, [tickets, activeTab]);

  const paginatedTickets = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredTickets.slice(start, start + rowsPerPage);
  }, [filteredTickets, page, rowsPerPage]);

  const selectedTicket = tickets.find((t) => t.ticketId === selectedId);

  if (loading) {
    return (
      <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: colors.brand }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
     
     

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 1.5, alignItems: "start" }}>
        <Box sx={{ ...glassPanel, height: PANEL_HEIGHT, display: "flex", flexDirection: "column" }}>
          <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
            <Typography fontWeight={700} fontSize="0.85rem" color={colors.textPrimary}>
              Tickets Overview
            </Typography>
          </Box>

          <Box sx={{ borderBottom: `1px solid ${colors.border}`, px: 0.5 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              TabIndicatorProps={{ style: { backgroundColor: colors.brand } }}
              sx={{
                minHeight: 34,
                "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.74rem", color: colors.textSecondary, minHeight: 34, py: 0.5 },
                "& .Mui-selected": { color: `${colors.brand} !important` },
              }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.key} value={tab.key} label={`${tab.label} (${counts[tab.key]})`} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {["Subject", "Priority", "Status", "Updated", ""].map((h) => (
                    <TableCell key={h} sx={{ color: colors.textMuted, fontWeight: 600, fontSize: "0.66rem", backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, py: 0.75 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTickets.map((ticket) => {
                  const priority = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.MEDIUM;
                  const status = STATUS_COLORS[ticket.status] || STATUS_COLORS.OPEN;
                  const isSelected = ticket.ticketId === selectedId;
                  return (
                    <TableRow
                      key={ticket.ticketId}
                      onClick={() => setSelectedId(ticket.ticketId)}
                      sx={{ cursor: "pointer", backgroundColor: isSelected ? colors.brandSoft : "transparent", "&:hover": { backgroundColor: isSelected ? colors.brandSoft : colors.bg } }}
                    >
                      <TableCell sx={{ border: "none", fontSize: "0.76rem", color: colors.textPrimary, py: 0.75 }}>{ticket.title}</TableCell>
                      <TableCell sx={{ border: "none", py: 0.75 }}>
                        <Box sx={{ display: "inline-block", px: 1, py: 0.2, borderRadius: "999px", backgroundColor: priority.bg, color: priority.text, fontSize: "0.64rem", fontWeight: 700 }}>
                          {ticket.priority}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: "none", py: 0.75 }}>
                        <Box sx={{ display: "inline-block", px: 1, py: 0.2, borderRadius: "999px", backgroundColor: status.bg, color: status.text, fontSize: "0.64rem", fontWeight: 700 }}>
                          {ticket.status?.replace(/_/g, " ")}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: "none", fontSize: "0.7rem", color: colors.textMuted, py: 0.75 }}>{timeAgo(ticket.updatedAt)}</TableCell>
                      <TableCell sx={{ border: "none", py: 0.75 }}>
                        <IconButton size="small"><ChevronRightIcon sx={{ fontSize: 16, color: colors.textMuted }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={filteredTickets.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 8, 10]}
            sx={{
              borderTop: `1px solid ${colors.border}`,
              minHeight: 40,
              "& .MuiTablePagination-toolbar": { minHeight: 40, fontSize: "0.72rem" },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { fontSize: "0.72rem" },
            }}
          />
        </Box>

        <Box sx={{ ...glassPanel, p: 0 }}>
          <TicketDetailCard
            ticket={selectedTicket}
            technicians={technicians}
            onChanged={loadTickets}
            onToast={setToast}
            height={PANEL_HEIGHT}
          />
        </Box>
      </Box>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast && <Alert severity={toast.type} onClose={() => setToast(null)}>{toast.message}</Alert>}
      </Snackbar>
      <Button
          startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          variant="outlined"
          onClick={loadTickets}
          size="small"
          sx={{ color: colors.textPrimary, borderColor: colors.border, textTransform: "none", fontWeight: 600, fontSize: "0.76rem", borderRadius: "8px" }}
        >
          Refresh
        </Button>
    </Box>
  );
}