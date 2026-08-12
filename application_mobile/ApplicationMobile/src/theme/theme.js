import { StyleSheet } from 'react-native';

// Single source of truth for design tokens.
export const colors = {
  // Core palette
  primary: '#2563EB',
  primaryMid: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryTint: '#DBEAFE',
  primaryDark: '#1E3A8A',

  background: '#F8FAFC',
  backgroundLight: '#F8FAFC',
  white: '#FFFFFF',

  // Text
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',

  // Status accents
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#DBEAFE',

  border: '#E5E7EB',
  overlay: 'rgba(17, 24, 39, 0.4)',
};

// Soft blue gradient
export const gradients = {
  primary: ['#3B82F6', '#2563EB'],
  primarySoft: ['#60A5FA', '#3B82F6'],
  sky: ['#BFDBFE', '#93C5FD', '#60A5FA'],
};

export const typography = {
  fontFamily: undefined,
  sizes: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 19,
    xxl: 24,
    display: 28,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  hero: 28,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
};

// 🚀 FIX: Added the missing globalStyles!
export const globalStyles = StyleSheet.create({
  surfaceCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.card,
  },
});

// Updated theme object to include globalStyles
const theme = { colors, gradients, typography, spacing, radii, shadow, globalStyles };
export default theme;