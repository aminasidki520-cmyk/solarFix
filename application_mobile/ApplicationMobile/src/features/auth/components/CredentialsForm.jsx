import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../../theme/theme';

export default function CredentialsForm({ username, password, onChangeUsername, onChangePassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <View style={styles.field}>
        <Ionicons name="person-outline" size={18} color={colors.textMuted} style={styles.fieldIcon} />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={onChangeUsername}
          placeholder="Username"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={[styles.field, { marginTop: spacing.md }]}>
        <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.fieldIcon} />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={onChangePassword}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((v) => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    height: 54,
  },
  fieldIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
});
