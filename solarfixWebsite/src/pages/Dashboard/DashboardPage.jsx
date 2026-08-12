// src/pages/Dashboard/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import StatCard from "../../components/dashboard/StatCard";
import TicketsTrendChart, { buildWeeklyTrend } from "../../components/dashboard/TicketsTrendChart";
import PendingAssignmentsList from "../../components/dashboard/PendingAssignmentsList";
import TeamCollaborationWidget from "../../components/dashboard/TeamCollaborationWidget";
import ProgressDonut from "../../components/dashboard/ProgressDonut";

import anomalyService from "../../services/anomalyService";
import ticketService from "../../services/ticketService";
import technicianService from "../../services/technicianService";

import { colors, glassPanelElevated } from "../../theme";

function extractList(settledResult) {
  if (settledResult.status !== "fulfilled") return [];
  const data = settledResult.value;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [anomalies, setAnomalies] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [anomalyRes, ticketRes, technicianRes] = await Promise.allSettled([
        anomalyService.getAll(),
        ticketService.getAll(),
        technicianService.getAll(),
      ]);
      setAnomalies(extractList(anomalyRes));
      setTickets(extractList(ticketRes));
      setTechnicians(extractList(technicianRes));
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ height: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  const totalTickets = tickets.length;
  const endedTickets = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;
  const runningTickets = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const pendingApprovals = tickets.filter(
    t => t.status !== "RESOLVED" && t.assignments && t.assignments.length > 0 && t.assignments[0].status === "PENDING"
  ).length;

  // 🚀 HAUTEUR DE LIGNE AUGMENTÉE à 240px pour laisser de la place aux bâtons plus larges
  const ROW_HEIGHT = 240;

  return (
    <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto", display: "flex", flexDirection: "column", gap: 1, minHeight: "fit-content", pb: 1 }}>
      

      {/* 2. STATISTICS (Cartes ultra compactes) */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 0.75 }}>
        <StatCard compact title="Total Tickets" value={totalTickets} icon={<ConfirmationNumberOutlinedIcon fontSize="small" />} variant="filled" onClick={() => navigate("/tickets")} />
        <StatCard compact title="Ended Tickets" value={endedTickets} icon={<CheckCircleOutlineOutlinedIcon fontSize="small" />} onClick={() => navigate("/tickets")} trendDirection="up" trendText="+12% this month" />
        <StatCard compact title="Running" value={runningTickets} icon={<AccessTimeFilledIcon fontSize="small" />} onClick={() => navigate("/tickets")} trendDirection="neutral" />
        <StatCard compact title="Pending Approval" value={pendingApprovals} icon={<WarningAmberOutlinedIcon fontSize="small" />} onClick={() => navigate("/tickets")} trendDirection="down" />
      </Box>

      {/* 3. MAIN ANALYTICS ROW (Graphique + Liste) */}
      {/* 🚀 ROW_HEIGHT est maintenant de 240px, les bâtons vont s'intégrer parfaitement */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.4fr) minmax(280px, 0.6fr)" }, gap: 1, alignItems: "start" }}>
        <Box sx={{ minWidth: 0, height: ROW_HEIGHT }}>
          <TicketsTrendChart compact data={buildWeeklyTrend(tickets)} />
        </Box>
        <Box sx={{ ...glassPanelElevated, height: ROW_HEIGHT, borderRadius: "18px", p: 0.75, display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: 'border-box' }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 0.75, flexShrink: 0 }}>
            <Typography fontWeight={700} fontSize="0.8rem" color={colors.textPrimary}>Pending</Typography>
            <Button size="small" onClick={() => navigate("/tickets/new")} startIcon={<AddRoundedIcon />} variant="contained" sx={{ minWidth: "auto", height: 24, px: 1, borderRadius: "9px", textTransform: "none", fontSize: "0.6rem", fontWeight: 700, bgcolor: colors.primaryLight, color: "#fff", boxShadow: "none", "&:hover": { bgcolor: colors.primary } }}>New Ticket</Button>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", pr: 0.25 }}>
            <PendingAssignmentsList compact tickets={tickets} />
          </Box>
        </Box>
      </Box>

      {/* 4. BOTTOM ROW (Collaboration + Progression) */}
     <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1, alignItems: "stretch" }}>
        
        {/* GAUCHE : Team Collaboration */}
        <Box sx={{ minWidth: 0, height: "100%" }}>
          <TeamCollaborationWidget technicians={technicians} tickets={tickets} compact />
        </Box>

        {/* DROITE : Overall Progress (Titre statique, contenu flexible) */}
        <Box 
          sx={{ 
            ...glassPanelElevated, 
            borderRadius: "18px", 
            p: 1.5, // 🚀 Padding uniforme et réduit
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            overflow: "hidden" 
          }}
        >
          <Typography fontWeight={700} fontSize="0.9rem" color={colors.textPrimary} align="center" sx={{ mb: 0.5 }}>
            Project Progress
          </Typography>
          
          {/* 🚀 Conteneur qui s'étire pour remplir l'espace disponible */}
          <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
            <ProgressDonut 
              completed={endedTickets} 
              running={runningTickets} 
              pending={pendingApprovals} 
              compact 
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}