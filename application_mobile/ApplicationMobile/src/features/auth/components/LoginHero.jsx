import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// npx expo install expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing, typography } from '../../../theme/theme';

// ⚠️ The screenshot shows a photo illustration of a technician on a solar
// farm. That's a real image asset, not something I can generate here —
// this uses simple icon accents instead. Drop a real image into
// assets/ and swap in an <Image> if you want the exact illustration.
export default function LoginHero({ isOnline }) {
  return (
    <LinearGradient colors={gradients.sky} style={styles.hero}>
      <View style={styles.statusRow}>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.danger }]} />
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      <View style={styles.logoRow}>
        <Ionicons name="sunny" size={30} color="#F59E0B" />
        <Text style={styles.logo}>
          Solar<Text style={styles.logoAccent}>Fix</Text>
        </Text>
      </View>
      <Text style={styles.subtitle}>Technician App</Text>

      <View style={styles.decor}>
        <Ionicons name="person-circle" size={72} color="rgba(255,255,255,0.55)" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl + spacing.xl,
  },
  statusRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    gap: 6,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.textPrimary },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  logo: { fontSize: typography.sizes.display, fontWeight: typography.weights.bold, color: colors.textPrimary },
  logoAccent: { color: colors.primary },
  subtitle: { fontSize: typography.sizes.md, color: colors.textSecondary, marginTop: 2 },
  decor: { position: 'absolute', right: spacing.lg, bottom: spacing.lg, opacity: 0.9 },
});
