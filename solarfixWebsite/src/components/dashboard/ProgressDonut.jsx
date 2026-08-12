// src/components/dashboard/ProgressDonut.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { colors } from '../../theme';

export default function ProgressDonut({ completed, running, pending, compact }) {
  const DARK_GREEN = '#217E53';
  const LIGHT_GREEN = '#61BC92';
  const HATCH_LINE = '#D8DEDB';
  const HATCH_BG = '#F4F6F5';

  const total = completed + running + pending;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = [
    { name: 'Completed', value: completed, fill: DARK_GREEN },
    { name: 'In Progress', value: running, fill: LIGHT_GREEN },
    { 
      name: 'Pending', 
      value: Math.max(0, total - completed - running), 
      fill: 'url(#diagonalHatch)' 
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* 🚀 Conteneur du graphique avec flex: 1 pour remplir tout l'espace disponible sans excès */}
      <Box sx={{ width: '100%', flex: 1, minHeight: 0, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <pattern id="diagonalHatch" width="5" height="5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <rect width="5" height="5" fill={HATCH_BG} />
                <line x1="0" y1="0" x2="0" y2="5" stroke={HATCH_LINE} strokeWidth="1.2" />
              </pattern>
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 🚀 Positionnement du texte à 45% pour qu'il soit centré dans l'anneau */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '45%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            textAlign: 'center' 
          }}
        >
          <Typography variant="h4" fontWeight={800} color={colors.textPrimary} sx={{ fontSize: compact ? '1.6rem' : '2rem', lineHeight: 1 }}>
            {percent}%
          </Typography>
          <Typography variant="caption" fontWeight={600} color={colors.textMuted} sx={{ fontSize: compact ? '0.7rem' : '0.8rem', mt: -0.5 }}>
            Completed
          </Typography>
        </Box>
      </Box>

      {/* Légende en bas */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mt: 0.5, pb: 0.5 }}>
        <LegendDot color={DARK_GREEN} label="Completed" />
        <LegendDot color={LIGHT_GREEN} label="In Progress" />
        <LegendDot hatch label="Pending" />
      </Box>
    </Box>
  );
}

function LegendDot({ color, hatch, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box 
        sx={{ 
          width: 10, 
          height: 10, 
          borderRadius: '50%', 
          background: hatch ? 'url(#diagonalHatch)' : color,
          border: '1px solid #E5E7EB'
        }} 
      />
      <Typography variant="caption" color={colors.textSecondary} sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  );
}