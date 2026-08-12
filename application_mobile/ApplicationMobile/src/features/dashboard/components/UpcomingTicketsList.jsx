import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pill } from '../../../components/ui';
import { colors, radii, spacing, typography, shadow } from '../../../theme/theme';

const PRIORITY_TONE = {
  HIGH: 'danger',
  CRITICAL: 'danger',
  NORMAL: 'warning',
  LOW: 'info',
};

const PRIORITY_ICON_BG = {
  HIGH: colors.dangerLight,
  CRITICAL: colors.dangerLight,
  NORMAL: colors.warningLight,
  LOW: colors.infoLight,
};

const PRIORITY_ICON_COLOR = {
  HIGH: colors.danger,
  CRITICAL: colors.danger,
  NORMAL: colors.warning,
  LOW: colors.info,
};

function TicketRow({ ticket, onPress }) {
  const iconBg = PRIORITY_ICON_BG[ticket.priority] ?? colors.infoLight;
  const iconColor = PRIORITY_ICON_COLOR[ticket.priority] ?? colors.info;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name="hardware-chip-outline" size={18} color={iconColor} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>{ticket.title}</Text>
        {ticket.location && <Text style={styles.subtitle} numberOfLines={1}>{ticket.location}</Text>}
      </View>
      <Pill label={ticket.priority} tone={PRIORITY_TONE[ticket.priority] ?? 'info'} />
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
    </TouchableOpacity>
  );
}

export default function UpcomingTicketsList({ tickets, onSelect }) {
  if (tickets.length === 0) return null;

  return (
    <View style={styles.list}>
      {tickets.map((t, i) => (
        <View key={t.ticketId}>
          <TicketRow ticket={t} onPress={() => onSelect(t)} />
          {i < tickets.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: spacing.xs,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1, marginHorizontal: spacing.md },
  title: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.textPrimary },
  subtitle: { fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: 2 },
  chevron: { marginLeft: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg + 36 + spacing.md },
});
