import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/features/auth/LoginScreen';
import { colors } from './src/theme/theme';

// Configure how notifications behave while the app is open (in foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AppShell() {
  const { user, isLoading } = useAuth();
  const navigationRef = useRef(null);

  //  HANDLE NOTIFICATION CLICKS
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { ticketId } = response.notification.request.content.data;
      
      if (ticketId && navigationRef.current) {
        // Navigate directly to the Ticket Detail screen
        navigationRef.current.navigate('Today', {
          screen: 'TicketDetail',
          params: { ticketId: ticketId }
        });
      }
    });

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
    // ATTACH THE REF TO THE NAVIGATION CONTAINER
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