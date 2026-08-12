import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui';
import { colors, spacing, typography } from '../../../theme/theme';

export default function DescriptionCard({ description }) {
  if (!description) return null;

  return (
    <Card>
      <Text style={styles.title}>What happened?</Text>
      <Text style={styles.body}>{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  body: { fontSize: typography.sizes.md, color: colors.textSecondary, lineHeight: 21 },
});
