import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../theme/theme';

// Generic — no dashboard-specific logic. Just an icon, a count, a label,
// and an active state.
export default function StatusChip({ icon, count, label, isActive, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <Ionicons name={icon} size={16} color={isActive ? colors.primary : colors.textMuted} />
        <Text style={[styles.count, isActive && styles.countActive]}>{count}</Text>
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
      {isActive && <View style={styles.activeBar} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  chipActive: {
    backgroundColor: colors.primaryTint,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  count: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginLeft: 6,
  },
  countActive: { color: colors.primary },
  label: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: typography.weights.medium,
  },
  labelActive: { color: colors.primary, fontWeight: typography.weights.semibold },
  activeBar: {
    marginTop: 6,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
