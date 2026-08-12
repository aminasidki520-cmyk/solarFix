import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../../components/ui';
import { colors, spacing, typography } from '../../../theme/theme';

export default function TicketTopBar({ onBack, initials, onBellPress }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>Ticket</Text>

      <View style={styles.right}>
        <TouchableOpacity style={styles.bell} onPress={onBellPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Avatar initials={initials} size={30} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    minHeight: 48,
  },
  backButton: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  title: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.textPrimary },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bell: { padding: 2 },
});
