// src/components/dashboard/TicketsTrendChart.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { colors, glassPanelElevated } from "../../theme";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function buildWeeklyTrend(tickets = []) {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - dayOfWeek);

  const EMPTY_BAR_HEIGHT = 40; // Slightly taller due to larger bars
  const buckets = DAY_LABELS.map((label, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { day: label, date, created: 0, empty: EMPTY_BAR_HEIGHT };
  });

  tickets.forEach((ticket) => {
    if (!ticket?.createdAt) return;
    const created = new Date(ticket.createdAt);
    const bucket = buckets.find(
      (b) =>
        b.date.getFullYear() === created.getFullYear() &&
        b.date.getMonth() === created.getMonth() &&
        b.date.getDate() === created.getDate()
    );
    if (!bucket) return;
    bucket.created += 1;
  });
  return buckets;
}

export default function TicketsTrendChart({ compact = false, data }) {
  const DARK_GREEN = '#217E53';
  const LIGHT_GREEN = '#61BC92';
  const HATCH_LINE = '#D8DEDB';
  const HATCH_BG = '#F4F6F5';
  
  // 🚀 HAUTEUR DE LA CARTE AUGMENTÉE (Carte plus longue)
  const chartHeight = compact ? 180 : 220;

  return (
    // 🚀 PADDING TRÈS RÉDUIT (p: 0.5) pour maximiser la place des barres
    <Box sx={{ ...glassPanelElevated, p: 0.5, border: 'none', borderRadius: '16px', backgroundColor: '#FFFFFF', height: '100%' }}>
      
      {/* 🚀 Espacement réduit (mb: 0.5) entre le titre et le graphique */}
      <Typography fontWeight={650} fontSize="14px" color="#19332B" sx={{ letterSpacing: '-0.01em' }}>
        Project Analytics
      </Typography>
      <Typography variant="body2" fontSize="12px" color="#7A8782" sx={{ mb: 0.5, mt: 0.5 }}>
        Created tickets this week.
      </Typography>

      <Box sx={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer>
          {/* 🚀 Marges ajustées (top/bottom 0) et espacement entre barres réduit (8px) */}
          <BarChart 
            data={data} 
            margin={{ top: 0, right: 0, left: -10, bottom: 0 }} 
            barCategoryGap={8} 
          >
            <defs>
              <pattern id="diagonalHatch" width="5" height="5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <rect width="5" height="5" fill={HATCH_BG} />
                <line x1="0" y1="0" x2="0" y2="5" stroke={HATCH_LINE} strokeWidth="1" />
              </pattern>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#87938E', fontSize: 10, fontWeight: 500 }} dy={6} />
            <YAxis axisLine={false} tickLine={false} tick={false} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontSize: '12px' }} />
            
            {/* 🚀 BARRE TRÈS LARGE (barSize: 32) */}
            <Bar dataKey="empty" fill="url(#diagonalHatch)" barSize={32} radius={999} />
            <Bar dataKey="created" barSize={32} radius={999}>
              {data.map((entry, index) => {
                let fillColor = null;
                if (entry.created > 0) {
                  if (index === 2) fillColor = LIGHT_GREEN;
                  else fillColor = DARK_GREEN;
                }
                return <Cell key={`cell-${index}`} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}