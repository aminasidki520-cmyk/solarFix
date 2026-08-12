import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii } from '../../theme/theme';

// value: 0..1
export default function ProgressBar({ value = 0, height = 8 }) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped * 100}%`, height, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.backgroundLight,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.primary,
  },
});
