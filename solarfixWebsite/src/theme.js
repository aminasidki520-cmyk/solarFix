// src/theme.js
import { createTheme } from "@mui/material/styles";

export const colors = {
  // Nouvelle palette "Donezo"
  primary: '#1A4D3E',       // Vert foncé forêt
  primaryLight: '#76C56B',  // Vert lime
  primaryTint: '#E8F5E9',   // Fond vert très clair
  white: '#FFFFFF',
  background: '#F8F9FA',    // Gris très clair
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#76C56B',
  warning: '#F5B94C',
  danger: '#F26D6D',
};

export const glassPanel = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

export const glassPanelElevated = {
  ...glassPanel,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

// ✅ CORRECTION : On exporte la variable `theme` sous forme d'export nommé
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.textPrimary,
    },
    error: { main: colors.danger },
    warning: { main: colors.warning },
    success: { main: colors.success },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Poppins', -apple-system, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

// ✅ On garde aussi l'export par défaut pour éviter de casser d'autres imports
export default theme;