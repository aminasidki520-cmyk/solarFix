import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography, shadow } from '../../../theme/theme';

const OUTCOMES = [
  { key: 'FIXED', label: 'Fixed', icon: 'checkmark-circle' },
  { key: 'NEEDS_PART', label: 'Needs Part', icon: 'construct-outline' },
  { key: 'RESCHEDULED', label: 'Rescheduled', icon: 'calendar-outline' },
  { key: 'ESCALATE', label: 'Escalate', icon: 'warning-outline' },
];

export { OUTCOMES };

export default function OutcomeOptionsList({ selected, onSelect }) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="clipboard-outline" size={16} color={colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>How did it go?</Text>
      </View>

      {OUTCOMES.map((o) => {
        const isSelected = selected === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            style={[styles.row, isSelected && styles.rowSelected]}
            onPress={() => onSelect(o.key)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
              <Ionicons
                name={isSelected ? 'checkmark' : o.icon}
                size={16}
                color={isSelected ? colors.white : colors.primary}
              />
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.textPrimary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  rowSelected: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: { backgroundColor: colors.primary },
  label: { marginLeft: spacing.md, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.textPrimary },
  labelSelected: { color: colors.primary },
});
