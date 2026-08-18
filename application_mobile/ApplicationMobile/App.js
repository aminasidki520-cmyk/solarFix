import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { isExpoGo, getNotificationsModule } from './src/services/notificationsCompat';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/features/auth/LoginScreen';
import { colors } from './src/theme/theme';

// 1. Safely configure how notifications behave (ONLY if NOT in Expo Go)
if (!isExpoGo) {
  const Notifications = getNotificationsModule();
  if (Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
}

function AppShell() {
  const { user, isLoading } = useAuth();
  const navigationRef = useRef(null);

  // 2. Handle notification clicks (Safely guarded)
  useEffect(() => {
    // If we are in Expo Go, skip this entirely to avoid the native crash
    if (isExpoGo) return;

    const Notifications = getNotificationsModule();
    if (!Notifications) return;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { ticketId } = response.notification.request.content.data;
      
      if (ticketId && navigationRef.current) {
        navigationRef.current.navigate('Today', {
          screen: 'TicketDetail',
          params: { ticketId },
        });
      }
    });

    // Cleanup listener when the component unmounts
    return () => subscription.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});