import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

const ICONS = {
  Today: 'calendar-outline',
  Map: 'map-outline',
  Completed: 'checkmark-circle-outline',
};

// Passed as the `tabBar` prop to Tab.Navigator — fully custom so we
// control spacing/colors from the theme instead of default RN styling.
export default function CustomTabBar({ state, navigation }) {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? colors.primary : colors.textMuted;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.item}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons name={ICONS[route.name] ?? 'ellipse-outline'} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});
