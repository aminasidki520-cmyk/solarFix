import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/ui';
import { colors, radii, spacing, typography } from '../../../theme/theme';

export default function PhotoCard({ hasPhoto, onAddPhoto }) {
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Ionicons name="camera-outline" size={18} color={colors.primary} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Add Repair Photo</Text>
          <Text style={styles.subtitle}>
            {hasPhoto ? 'Photo attached and tagged.' : 'Take a photo of the completed repair for documentation.'}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddPhoto} activeOpacity={0.8}>
          <Ionicons name={hasPhoto ? 'checkmark' : 'camera'} size={16} color={colors.primary} />
          <Text style={styles.addButtonText}>{hasPhoto ? 'Added' : 'Add Photo'}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1, marginLeft: spacing.md, marginRight: spacing.sm },
  title: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.textPrimary },
  subtitle: { fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: 2 },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minWidth: 84,
    gap: 4,
  },
  addButtonText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.primary },
});
