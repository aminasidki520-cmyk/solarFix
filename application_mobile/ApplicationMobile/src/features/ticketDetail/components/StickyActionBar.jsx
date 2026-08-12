import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, shadow } from '../../../theme/theme';

export default function StickyActionBar({ readOnly = false, onStartWork, onCompleteJob, isStartingWork }) {
  // 🚀 AJOUT 1 : Si le ticket est en lecture seule (venant de l'historique), on ne rend RIEN.
  if (readOnly) {
    return null;
  }

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.outlineButton} onPress={onCompleteJob} activeOpacity={0.85}>
        <Text style={styles.outlineButtonText}>Complete Job</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.solidButton}
        onPress={onStartWork}
        activeOpacity={0.9}
        disabled={isStartingWork}
      >
        {isStartingWork ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.solidButtonText}>Start Work</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.raised,
  },
  solidButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solidButtonText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
  outlineButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
});