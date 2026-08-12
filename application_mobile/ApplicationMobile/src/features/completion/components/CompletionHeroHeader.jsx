import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// npx expo install expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, spacing, typography } from '../../../theme/theme';

export default function CompletionHeroHeader({ ticket, onBack }) {
  const ticketCode = ticket?.ticketId ? `TK-${ticket.ticketId}` : null;
  const metaLine = ticket ? [ticket.location, ticket.equipmentLabel].filter(Boolean).join(' · ') : null;

  return (
    <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="arrow-back" size={20} color={colors.white} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Complete Ticket</Text>

      {ticketCode && (
        <View style={styles.codePill}>
          <Text style={styles.codePillText}>{ticketCode}</Text>
        </View>
      )}

      <Text style={styles.title} numberOfLines={1}>{ticket?.title ?? 'Job'}</Text>

      {metaLine ? (
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.metaText}>{metaLine}</Text>
        </View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: { color: colors.white, fontSize: typography.sizes.xl, fontWeight: typography.weights.bold },
  codePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.md,
  },
  codePillText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  title: { color: colors.white, fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  metaText: { color: 'rgba(255,255,255,0.85)', fontSize: typography.sizes.sm },
});
