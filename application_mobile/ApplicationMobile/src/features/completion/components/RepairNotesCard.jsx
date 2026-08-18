import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/ui';
import { colors, radii, spacing, typography } from '../../../theme/theme';

export default function RepairNotesCard({ value, onChangeText }) {
  return (
    <Card>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>Repair Notes</Text>
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Describe what you repaired..."
          placeholderTextColor={colors.textMuted}
          multiline
        />
      </View>
    </Card>
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
  inputWrap: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 90,
  },
  input: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});