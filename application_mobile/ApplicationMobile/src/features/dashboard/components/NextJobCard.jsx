import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// npx expo install expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, spacing, typography, shadow } from '../../../theme/theme';

const PRIORITY_LABEL = {
  HIGH: { text: 'High Priority', color: '#FCA5A5' },
  CRITICAL: { text: 'Critical Priority', color: '#FCA5A5' },
  NORMAL: { text: 'Normal Priority', color: 'rgba(255,255,255,0.85)' },
  LOW: { text: 'Low Priority', color: 'rgba(255,255,255,0.85)' },
};

const PRIORITY_BADGE_BG = {
  HIGH: 'rgba(220, 38, 38, 0.35)',
  CRITICAL: 'rgba(220, 38, 38, 0.35)',
  NORMAL: 'rgba(255,255,255,0.2)',
  LOW: 'rgba(255,255,255,0.2)',
};

export default function NextJobCard({ ticket, onPress }) {
  if (!ticket) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="checkmark-done-circle-outline" size={28} color={colors.textMuted} />
        <Text style={styles.emptyText}>No ticket in this category.</Text>
      </View>
    );
  }

  const priorityLabel = PRIORITY_LABEL[ticket.priority] ?? PRIORITY_LABEL.NORMAL;
  const badgeBg = PRIORITY_BADGE_BG[ticket.priority] ?? PRIORITY_BADGE_BG.NORMAL;

  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="warning-outline" size={20} color={colors.white} />
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: badgeBg }]}>
          <Text style={styles.priorityBadgeText}>{ticket.priority}</Text>
        </View>
      </View>

      <Text style={[styles.priorityLabel, { color: priorityLabel.color }]}>{priorityLabel.text}</Text>
      <Text style={styles.title} numberOfLines={1}>{ticket.title}</Text>
      {(ticket.location || ticket.equipmentLabel) && (
        <Text style={styles.subtitle} numberOfLines={1}>
          {[ticket.location, ticket.equipmentLabel].filter(Boolean).join(' · ')}
        </Text>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.75)" />
          <Text style={styles.metaText}>Assigned {formatTime(ticket.assignedAt)}</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <View style={styles.statusDot} />
          <Text style={styles.metaText}>{ticket.status}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.buttonText}>Open Ticket</Text>
        <Ionicons name="arrow-forward" size={18} color={colors.primary} />
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
  priorityLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, marginTop: spacing.md },
  title: { color: colors.white, fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, marginTop: 4 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.md, marginTop: 4 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: 'rgba(255,255,255,0.85)', fontSize: typography.sizes.sm, marginLeft: 6 },
  metaDivider: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: spacing.md },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
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
  buttonText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radii.hero,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadow.card,
  },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm },
});
