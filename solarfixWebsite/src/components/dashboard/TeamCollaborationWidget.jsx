// src/components/dashboard/TeamCollaborationWidget.jsx
import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { colors, glassPanelElevated } from '../../theme';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function TeamCollaborationWidget({ technicians, tickets, compact }) {
  const topTechs = technicians.slice(0, 10).map((tech) => {
    const activeTickets = tickets.filter(t => t.assignments && t.assignments.some(a => a.technician?.id === tech.id)).length;
    return { ...tech, activeTickets };
  });

  return (
    <Box 
      sx={{ 
        ...glassPanelElevated, 
        p: compact ? 1.25 : 1.5, 
        height: "100%", // 🚀 S'étire pour égaliser la hauteur de la grille
        maxHeight: "220px", // Limite pour activer le scroll interne
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight={700} fontSize={compact ? "0.85rem" : "0.95rem"} color={colors.textPrimary}>
          Team Collaboration
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddRoundedIcon fontSize="small" />}
          sx={{
            fontSize: '0.65rem',
            borderRadius: '20px',
            borderColor: colors.border,
            color: colors.textSecondary,
            textTransform: 'none',
            py: 0,
            px: 1.5,
            height: 26,
            minWidth: 'auto',
          }}
        >
          Add
        </Button>
      </Box>

      {/* 🚀 ZONE DE DÉFILEMENT INTERNE */}
      <Box 
        sx={{ 
          overflowY: 'auto', 
          flex: 1, 
          pr: 0.5, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0.25
        }}
      >
        {topTechs.length === 0 ? (
          <Typography variant="body2" color={colors.textMuted} sx={{ py: 1, textAlign: 'center' }}>
            No technicians yet.
          </Typography>
        ) : (
          topTechs.map((tech) => (
            <Box 
              key={tech.id} 
              display="flex" 
              alignItems="center" 
              gap={1} 
              sx={{ 
                py: 0.4, 
                borderBottom: `1px solid ${colors.border}`, 
                '&:last-of-type': { borderBottom: 'none' } 
              }}
            >
              <Avatar sx={{ width: 22, height: 22, fontSize: '0.6rem', bgcolor: colors.primaryTint, color: colors.primary, fontWeight: 700 }}>
                {tech.firstName ? tech.firstName[0] : 'T'}
              </Avatar>
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" fontWeight={600} fontSize="0.75rem" color={colors.textPrimary} noWrap>
                  {tech.firstName} {tech.lastName}
                </Typography>
                <Typography variant="caption" color={colors.textMuted} fontSize="0.65rem" noWrap>
                  {tech.regionOfResponsibility || 'No region'}
                </Typography>
              </Box>
              <Box sx={{ width: 20, height: 3, borderRadius: 2, bgcolor: '#F3F4F6', overflow: 'hidden', flexShrink: 0 }}>
                <Box sx={{ width: tech.availability ? '100%' : '30%', height: '100%', bgcolor: colors.primaryLight, borderRadius: 2 }} />
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}