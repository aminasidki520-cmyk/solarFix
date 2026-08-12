import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// npx expo install expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, spacing, typography, shadow } from '../../../theme/theme';

const PRIORITY_BADGE_BG = {
  HIGH: 'rgba(239, 68, 68, 0.25)',
  CRITICAL: 'rgba(239, 68, 68, 0.25)',
  NORMAL: 'rgba(255,255,255,0.2)',
  LOW: 'rgba(255,255,255,0.2)',
};

const STATUS_LABEL = {
  OPEN: 'Open',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  WAITING: 'Waiting',
  PENDING: 'Pending',
  RESOLVED: 'Completed',
  CLOSED: 'Closed',
};

export default function TicketHeroCard({ ticket, onOpenMaps }) {
  const priorityBg = PRIORITY_BADGE_BG[ticket.priority] ?? PRIORITY_BADGE_BG.NORMAL;
  const statusLabel = STATUS_LABEL[ticket.status] ?? ticket.status;
  const hasCoords = ticket.latitude != null && ticket.longitude != null;

  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="warning-outline" size={22} color={colors.white} />
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
          <Text style={styles.priorityBadgeText}>{ticket.priority}</Text>
        </View>
      </View>

      <Text style={styles.title}>{ticket.title}</Text>

      {(ticket.location || ticket.equipmentLabel) && (
        <View style={styles.metaBlock}>
          {ticket.location && (
            <View style={styles.metaLine}>
              <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.85)" />
              <Text style={styles.metaText}>{ticket.location}</Text>
            </View>
          )}
          {ticket.equipmentLabel && (
            <View style={styles.metaLine}>
              <Ionicons name="hardware-chip-outline" size={14} color="rgba(255,255,255,0.85)" />
              <Text style={styles.metaText}>{ticket.equipmentLabel}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.statusChip}>
          <View style={styles.statusDot} />
          <Text style={styles.statusChipText}>{statusLabel}</Text>
        </View>
        <View style={styles.metaLine}>
          <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.75)" />
          <Text style={styles.assignedText}>Assigned {formatTime(ticket.assignedAt)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !hasCoords && styles.buttonDisabled]}
        onPress={onOpenMaps}
        activeOpacity={0.9}
        disabled={!hasCoords}
      >
        <Ionicons name="navigate" size={18} color={colors.primary} />
        <Text style={styles.buttonText}>Open in Maps</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

function formatTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.hero,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    ...shadow.raised,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityBadge: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  priorityBadgeText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  title: {
    color: colors.white,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginTop: spacing.md,
  },
  metaBlock: { marginTop: spacing.sm, gap: 4 },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: 'rgba(255,255,255,0.9)', fontSize: typography.sizes.md },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: spacing.lg },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  statusChipText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  assignedText: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.xs },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    minHeight: 52,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
});
