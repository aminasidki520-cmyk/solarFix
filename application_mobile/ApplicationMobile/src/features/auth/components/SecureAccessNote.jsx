import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../../theme/theme';

export default function SecureAccessNote() {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Secure Access</Text>
        <Text style={styles.subtitle}>Your data is protected and encrypted end-to-end</Text>
      </View>
      <Ionicons name="lock-closed" size={16} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1, marginHorizontal: spacing.md },
  title: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.textPrimary },
  subtitle: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
});
