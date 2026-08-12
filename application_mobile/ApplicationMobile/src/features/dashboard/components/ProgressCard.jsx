import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar } from '../../../components/ui';
import { colors, spacing, typography } from '../../../theme/theme';

export default function ProgressCard({ completedCount, totalCount }) {
  const ratio = totalCount > 0 ? completedCount / totalCount : 0;
  const percent = Math.round(ratio * 100);

  return (
    <Card>
      <View style={styles.row}>
        <Text style={styles.caption}>
          {completedCount} of {totalCount} tickets completed
        </Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <ProgressBar value={ratio} height={8} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  caption: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: typography.weights.medium },
  percent: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.primary },
});
