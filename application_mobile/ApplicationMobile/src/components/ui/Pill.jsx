import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/theme';

// Maps a semantic tone to background/text colors so callers don't pass
// raw hex values — e.g. <Pill label="LOW" tone="info" />
const TONES = {
  info: { bg: colors.infoLight, text: colors.info },
  success: { bg: colors.successLight, text: colors.success },
  warning: { bg: colors.warningLight, text: colors.warning },
  danger: { bg: colors.dangerLight, text: colors.danger },
  onDark: { bg: 'rgba(255,255,255,0.2)', text: colors.white },
};

export default function Pill({ label, tone = 'info' }) {
  const { bg, text } = TONES[tone] ?? TONES.info;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
