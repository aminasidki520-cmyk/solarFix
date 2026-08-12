// src/pages/TicketDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

import ticketService from "../../services/ticketService";
import technicianService from "../../services/technicianService";
import { colors } from "../../theme";
// ✅ Import the exact component we just fixed!
import TicketDetailCard from "../../components/tickets/TicketDetailCard";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    console.log("🟢 [TicketDetailsPage] fetchData START");
    setLoading(true);
    try {
      const [ticketRes, techRes] = await Promise.all([
        ticketService.getById(id),
        technicianService.getAll(),
      ]);

      // Handle potential array wrapping
      const ticketData = Array.isArray(ticketRes) ? ticketRes[0] : ticketRes;
      setTicket(ticketData);

      const techList = Array.isArray(techRes) ? techRes : techRes?.data?.content || [];
      setTechnicians(techList);
    } catch (error) {
      console.error("❌ Error fetching ticket details:", error);
      setToast({ type: "error", message: "Failed to load ticket details." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Button onClick={() => navigate("/tickets")} sx={{ mt: 2 }}>Back to Tickets</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, mb: 4 }}>
      {/* Back Button & Refresh */}
           {/* Back Button & Refresh */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 2,           // 🚀 Adds space between the two buttons
          mb: 3,            // 🚀 Increases space between the buttons and the card below
          flexWrap: 'wrap' 
        }}
      >
        <Button
          size="small"      // 🚀 Smaller size
          startIcon={<ArrowBackIcon fontSize="small" />} // 🚀 Smaller icon
          onClick={() => navigate("/tickets")}
          sx={{ 
            color: colors.textSecondary, 
            textTransform: "none", 
            fontWeight: 600, 
            fontSize: "0.85rem" // 🚀 Smaller font
          }}
        >
          Back to List
        </Button>
        <Button
          size="small"      // 🚀 Smaller size
          startIcon={<RefreshIcon fontSize="small" />} // 🚀 Smaller icon
          variant="outlined"
          onClick={fetchData}
          sx={{
            textTransform: "none",
            borderRadius: "8px", // 🚀 Slightly smaller rounded corners
            fontSize: "0.8rem",  // 🚀 Smaller font
            px: 1.5,             // 🚀 Reduced horizontal padding
            py: 0.5,             // 🚀 Reduced vertical padding
            color: colors.primary,
            borderColor: colors.border,
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* ✅ Pass the ticket, technicians, and callbacks to the exact component */}
      <TicketDetailCard
        ticket={ticket}
        technicians={technicians}
        onChanged={fetchData}
        onToast={setToast}
        role="ADMIN"
        height="auto" // Allows the card to grow to fit the entire page
      />

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        {toast && <Alert severity={toast.type} onClose={() => setToast(null)}>{toast.message}</Alert>}
      </Snackbar>
    </Box>
  );
}