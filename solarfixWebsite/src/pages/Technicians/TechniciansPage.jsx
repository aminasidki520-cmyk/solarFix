// src/pages/Technicians/TechniciansPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  InputBase,
  CircularProgress,
  IconButton,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
} from "@mui/material";
import EngineeringRoundedIcon from "@mui/icons-material/EngineeringRounded";
import SearchIcon from "@mui/icons-material/Search";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import technicianService from "../../services/technicianService";
import ticketService from "../../services/ticketService";
import AddTechnicianDialog from "../../components/technicians/AddTechnicianDialog";
import { colors, glassPanel } from "../../theme";

const TERMINAL_TICKET_STATUSES = ["RESOLVED", "CLOSED", "CANCELLED"];
const TERMINAL_ASSIGNMENT_STATUSES = ["REJECTED"];
const PAGE_SIZE = 8;

function deriveStatus(tech, activeCount) {
  if (!tech.availability) return "UNAVAILABLE";
  if (activeCount > 0) return "BUSY";
  return "AVAILABLE";
}

// 🚀 Correction des couleurs pour correspondre à ton theme.js réel
const STATUS_STYLES = {
  AVAILABLE: { bg: colors.successLight, text: colors.success, label: "Available" },
  BUSY: { bg: colors.warningLight, text: colors.warning, label: "Busy" },
  UNAVAILABLE: { bg: colors.dangerLight, text: colors.danger, label: "Unavailable" },
};

function timeAgo(dateString) {
  if (!dateString) return "—";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function initials(firstName, lastName) {
  return `${(firstName || "?")[0]}${(lastName || "?")[0]}`.toUpperCase();
}

// 🚀 Palette d'avatar basée sur tes couleurs existantes (primary et primaryTint)
const AVATAR_PALETTE = [
  { bg: colors.primaryTint, text: colors.primary },
  { bg: "#E3EAFE", text: "#5B6FE3" },
  { bg: "#FDF0DC", text: "#C98A2E" },
  { bg: "#F0E3FE", text: "#8B5CF6" },
  { bg: "#DFF6EF", text: "#1FAE7C" },
];
function avatarStyle(id) {
  const idx = Math.abs(Number(id) || 0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

// StatCard simplifiée et propre
function StatCard({ icon, iconBg, iconColor, value, label }) {
  return (
    <Box sx={{ ...glassPanel, p: 2.5, display: "flex", alignItems: "center", gap: 1.5, width: "100%", boxSizing: "border-box" }}>
      <Box
        sx={{
          width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
          backgroundColor: iconBg, color: iconColor,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box minWidth={0}>
        <Typography fontWeight={700} fontSize="1.4rem" color={colors.textPrimary} lineHeight={1.1}>
          {value}
        </Typography>
        <Typography fontSize="0.82rem" color={colors.textMuted} noWrap>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

export default function TechniciansPage() {
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [activeCountByTechId, setActiveCountByTechId] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [techRes, ticketRes] = await Promise.allSettled([
        technicianService.getAll(),
        ticketService.getAll(),
      ]);

      const techData = techRes.status === "fulfilled" ? techRes.value : [];
      const ticketData = ticketRes.status === "fulfilled" ? ticketRes.value : [];
      
      const techList = Array.isArray(techData) ? techData : techData?.content || [];
      const ticketList = Array.isArray(ticketData) ? ticketData : ticketData?.content || [];

      // Active (non-rejected) assignments on non-terminal tickets per technician
      const counts = {};
      ticketList.forEach((ticket) => {
        if (TERMINAL_TICKET_STATUSES.includes(ticket.status)) return;
        (ticket.assignments || []).forEach((assignment) => {
          if (TERMINAL_ASSIGNMENT_STATUSES.includes(assignment.status)) return;
          const techId = assignment.technician?.id;
          if (techId == null) return;
          counts[techId] = (counts[techId] || 0) + 1;
        });
      });

      setTechnicians(techList);
      setActiveCountByTechId(counts);
    } catch (error) {
      console.error("Technicians loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnicians = useMemo(() => {
    if (!searchTerm.trim()) return technicians;
    const q = searchTerm.toLowerCase();
    return technicians.filter(
      (t) =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.regionOfResponsibility?.toLowerCase().includes(q) ||
        (t.skills || []).some((s) => s.toLowerCase().includes(q))
    );
  }, [technicians, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredTechnicians.length / PAGE_SIZE));
  const pagedTechnicians = filteredTechnicians.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    let available = 0, busy = 0, unavailable = 0;
    technicians.forEach((t) => {
      const status = deriveStatus(t, activeCountByTechId[t.id] || 0);
      if (status === "AVAILABLE") available += 1;
      else if (status === "BUSY") busy += 1;
      else unavailable += 1;
    });
    return { total: technicians.length, available, busy, unavailable };
  }, [technicians, activeCountByTechId]);

  if (loading) {
    return (
      <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* 🚀 Remplacement de colors.brand par colors.primary */}
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
      
      {/* 🚀 HEADER : Titre + Sous-titre à gauche, Contrôles à droite */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color={colors.textPrimary}>
            Technicians
          </Typography>
          <Typography variant="body2" color={colors.textMuted}>
            Manage and monitor your field technicians
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          {/* Barre de recherche en forme de pilule */}
          <Box
            sx={{
              display: "flex", alignItems: "center", backgroundColor: colors.white,
              border: `1px solid ${colors.border}`, borderRadius: "999px", px: 1.5, py: 0.6,
              width: { xs: "100%", sm: 240 }, flexShrink: 1, boxSizing: "border-box",
              "&:focus-within": { borderColor: colors.primary },
            }}
          >
            <SearchIcon sx={{ color: colors.textMuted, fontSize: 18, mr: 1, flexShrink: 0 }} />
            <InputBase
              placeholder="Search technician..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ color: colors.textPrimary, fontSize: "0.85rem", width: "100%" }}
            />
          </Box>

          {/* Bouton Filtre en pilule */}
          <IconButton
            sx={{
              border: `1px solid ${colors.border}`, borderRadius: "999px",
              color: colors.textSecondary, width: 40, height: 40, flexShrink: 0,
            }}
          >
            <FilterListRoundedIcon fontSize="small" />
          </IconButton>

          {/* Bouton Add Technician vert */}
          <Button
            onClick={() => setAddOpen(true)}
            startIcon={<AddRoundedIcon />}
            sx={{
              textTransform: "none", fontWeight: 700, fontSize: "0.82rem", borderRadius: "999px",
              backgroundColor: colors.primary, color: "#fff", px: 2.5, height: 40, flexShrink: 0,
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: colors.primaryDark },
            }}
          >
            Add Technician
          </Button>
        </Box>
      </Box>

      {/* 🚀 STAT CARDS : Espacées, avec exactement 4 colonnes */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <StatCard
          icon={<PeopleAltRoundedIcon fontSize="small" />}
          iconBg={colors.primaryTint}
          iconColor={colors.primary}
          value={stats.total}
          label="Total Technicians"
        />
        <StatCard
          icon={<Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: colors.success }} />}
          iconBg={colors.successLight}
          iconColor={colors.success}
          value={stats.available}
          label="Available"
        />
        <StatCard
          icon={<AccessTimeRoundedIcon fontSize="small" />}
          iconBg={colors.warningLight}
          iconColor={colors.warning}
          value={stats.busy}
          label="Busy"
        />
        <StatCard
          icon={<Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: colors.danger }} />}
          iconBg={colors.dangerLight}
          iconColor={colors.danger}
          value={stats.unavailable}
          label="Unavailable"
        />
      </Box>

      {/* 🚀 TABLEAU : avec en-tête vert clair et bords arrondis */}
      <Box sx={{ ...glassPanel, p: 0, width: "100%", boxSizing: "border-box", borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              {/* En-tête vert clair personnalisé */}
              <TableRow sx={{ bgcolor: colors.sectionHeaderBg || '#EEF7E9' }}>
                {["Technician", "Region", "Skills", "Status", "Active Tickets", "Last Active", ""].map((head) => (
                  <TableCell
                    key={head || "actions"}
                    sx={{
                      color: colors.textMuted,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      py: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedTechnicians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ border: "none", py: 4 }}>
                    <Typography color={colors.textMuted} fontSize="0.85rem" textAlign="center">
                      No technicians found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pagedTechnicians.map((tech) => {
                  const activeCount = activeCountByTechId[tech.id] || 0;
                  const status = deriveStatus(tech, activeCount);
                  const statusStyle = STATUS_STYLES[status];
                  const avatarStyleForTech = avatarStyle(tech.id);
                  const visibleSkills = (tech.skills || []).slice(0, 2);
                  const extraSkillsCount = (tech.skills || []).length - visibleSkills.length;

                  return (
                    <TableRow key={tech.id} sx={{ "&:last-of-type td": { borderBottom: "none" } }}>
                      {/* Nom + Avatar */}
                      <TableCell sx={{ borderBottom: `1px solid ${colors.border}`, py: 1.5 }}>
                        <Box display="flex" alignItems="center" gap={1.25}>
                          <Avatar
                            sx={{
                              width: 34, height: 34, fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                              backgroundColor: avatarStyleForTech.bg, color: avatarStyleForTech.text,
                            }}
                          >
                            {initials(tech.firstName, tech.lastName)}
                          </Avatar>
                          <Box minWidth={0}>
                            <Typography fontWeight={700} fontSize="0.82rem" color={colors.textPrimary} noWrap>
                              {tech.firstName} {tech.lastName}
                            </Typography>
                            <Typography fontSize="0.7rem" color={colors.textMuted} noWrap>
                              {tech.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Région */}
                      <TableCell sx={{ borderBottom: `1px solid ${colors.border}` }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <PlaceRoundedIcon sx={{ fontSize: 14, color: colors.textMuted, flexShrink: 0 }} />
                          <Box minWidth={0}>
                            <Typography fontSize="0.78rem" color={colors.textPrimary} noWrap>
                              {tech.regionOfResponsibility || "—"}
                            </Typography>
                            <Typography fontSize="0.68rem" color={colors.textMuted} noWrap>
                              {tech.country || "Morocco"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Compétences */}
                      <TableCell sx={{ borderBottom: `1px solid ${colors.border}` }}>
                        <Box display="flex" flexWrap="wrap" gap={0.5} maxWidth={200}>
                          {visibleSkills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              sx={{ backgroundColor: colors.primaryTint, color: colors.primary, fontSize: "0.68rem", height: 20, fontWeight: 600 }}
                            />
                          ))}
                          {extraSkillsCount > 0 && (
                            <Chip
                              label={`+${extraSkillsCount}`}
                              size="small"
                              sx={{ backgroundColor: colors.bg, color: colors.textMuted, fontSize: "0.68rem", height: 20 }}
                            />
                          )}
                        </Box>
                      </TableCell>

                      {/* Statut */}
                      <TableCell sx={{ borderBottom: `1px solid ${colors.border}` }}>
                        <Box display="flex" alignItems="center" gap={0.6}>
                          <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: statusStyle.text, flexShrink: 0 }} />
                          <Typography fontSize="0.78rem" fontWeight={700} color={statusStyle.text} noWrap>
                            {statusStyle.label}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Tickets actifs */}
                      <TableCell sx={{ borderBottom: `1px solid ${colors.border}` }}>
                        <Typography fontSize="0.82rem" fontWeight={600} color={colors.textPrimary}>
                          {activeCount}
                        </Typography>
                      </TableCell>

                      {/* Dernière activité */}
                      <TableCell sx={{ borderBottom: `1px solid ${colors.border}` }}>
                        <Typography fontSize="0.78rem" color={colors.textMuted} noWrap>
                          {timeAgo(tech.lastActiveAt)}
                        </Typography>
                      </TableCell>

                      {/* Menu actions */}
                      <TableCell sx={{ borderBottom: `1px solid ${colors.border}` }} align="right">
                        <IconButton size="small">
                          <MoreVertIcon sx={{ fontSize: 18, color: colors.textMuted }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            px: 2.5, py: 1.5,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Typography fontSize="0.75rem" color={colors.textMuted}>
            Showing {filteredTechnicians.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, filteredTechnicians.length)} of {filteredTechnicians.length} technicians
          </Typography>

          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton
              size="small"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ border: `1px solid ${colors.border}`, borderRadius: "8px" }}
            >
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <Box
                key={p}
                onClick={() => setPage(p)}
                sx={{
                  width: 28, height: 28, borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                  backgroundColor: p === page ? colors.primary : "transparent",
                  color: p === page ? "#fff" : colors.textSecondary,
                  border: p === page ? "none" : `1px solid ${colors.border}`,
                }}
              >
                {p}
              </Box>
            ))}

            <IconButton
              size="small"
              disabled={page === pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              sx={{ border: `1px solid ${colors.border}`, borderRadius: "8px" }}
            >
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <AddTechnicianDialog open={addOpen} onClose={() => setAddOpen(false)} onCreated={loadData} onToast={setToast} />
      
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        {toast ? <Alert severity={toast.type} onClose={() => setToast(null)} sx={{ width: "100%" }}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}