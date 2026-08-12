import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { testBackendConnection } from '../../api/debug';
import { colors, radii, spacing, typography, shadow } from '../../theme/theme';

import LoginHero from './components/LoginHero';
import CredentialsForm from './components/CredentialsForm';
import SecureAccessNote from './components/SecureAccessNote';

// Real username + password login. No PIN, no biometrics — you asked for
// the actual credentials the backend expects (e.g. tech1 / Tech123!).

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Missing info', 'Enter your username and password.');
      return;
    }

    const isConnected = await testBackendConnection();
    if (!isConnected) {
      Alert.alert('Connection Error', 'Cannot reach backend server. Please check:\n1. Backend is running\n2. Network connection\n3. URL is correct (BASE_URL)');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
    } catch (error) {
      console.error('[ERROR] Login error:', error);
      Alert.alert('Login failed', error.message || 'Check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <LoginHero isOnline={isOnline} />

        <View style={styles.sheet}>
          <Text style={styles.title}>Log in to your account</Text>
          <Text style={styles.subtitle}>Enter your username and password</Text>

          <View style={styles.formWrap}>
            <CredentialsForm
              username={username}
              password={password}
              onChangeUsername={setUsername}
              onChangePassword={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isSubmitting} activeOpacity={0.9}>
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.secureNoteWrap}>
            <SecureAccessNote />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: { flexGrow: 1 },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.hero,
    borderTopRightRadius: radii.hero,
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    ...shadow.raised,
  },
  title: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.textPrimary },
  subtitle: { fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: 4, marginBottom: spacing.xl },
  formWrap: { marginBottom: spacing.lg },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    minHeight: 56,
  },
  loginButtonText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
  secureNoteWrap: { marginTop: spacing.xl },
});