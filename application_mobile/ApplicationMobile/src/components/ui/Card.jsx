import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing, shadow } from '../../theme/theme';

// Generic surface used by every card-like widget. Takes only the padding
// it needs by default (spacing.lg) — pass `padding` to override, or
// `style` for one-off tweaks (e.g. a colored background).
export default function Card({ children, style, padding = spacing.lg }) {
  return <View style={[styles.base, { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    ...shadow.card,
  },
});
