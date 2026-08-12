import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../../components/ui';
import { colors, spacing, typography } from '../../../theme/theme';

// 🚀 UPGRADE: Returns both the greeting text AND a matching icon
function getGreetingData() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: 'partly-sunny' };
  if (hour < 18) return { text: 'Good afternoon', icon: 'sunny' };
  return { text: 'Good evening', icon: 'moon' };
}

export default function GreetingHeader({ name, initials, onBellPress, notificationCount = 0 }) {
  const greetingData = getGreetingData();

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.logo}>
          Solar<Text style={styles.logoAccent}>Fix</Text>
        </Text>
        <View style={styles.right}>
          <TouchableOpacity style={styles.bell} onPress={onBellPress}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Avatar initials={initials} />
        </View>
      </View>

      <View style={styles.greetingRow}>
        <Text style={styles.greeting}>
          {greetingData.text}, {name || 'there'} {/* 🚀 FALLBACK: prevents trailing commas */}
        </Text>
        <Ionicons name={greetingData.icon} size={20} color="#F59E0B" />
      </View>
      <Text style={styles.subGreeting}>Let's get your next job done.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.textPrimary },
  logoAccent: { color: colors.primary },
  right: { flexDirection: 'row', alignItems: 'center' },
  bell: { marginRight: spacing.md, padding: 2 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: typography.weights.bold },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: 6 },
  greeting: { fontSize: typography.sizes.display, fontWeight: typography.weights.bold, color: colors.textPrimary },
  subGreeting: { fontSize: typography.sizes.md, color: colors.textMuted, marginTop: 4 },
});