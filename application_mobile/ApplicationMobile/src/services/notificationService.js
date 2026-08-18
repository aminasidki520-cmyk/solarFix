// src/services/notificationService.js
import * as Device from 'expo-device';
import { isExpoGo, getNotificationsModule } from './notificationsCompat';

let ws = null;

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null;

  // Skip entirely in Expo Go — never call require('expo-notifications') here,
  // which avoids the module's own internal console.error noise.
  if (isExpoGo) {
    console.log('Skipping push registration: not supported in Expo Go.');
    return null;
  }

  const Notifications = getNotificationsModule();
  if (!Notifications) return null;

  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return null;

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('📱 Expo Push Token:', token);
    return token;
  } catch (error) {
    console.warn('Push registration failed:', error.message);
    return null;
  }
}

export function connectWebSocket(username, onNewTicketCallback) {
  if (ws) return;

  const WS_URL = `ws://10.43.28.108:8082/ws`;
  ws = new WebSocket(WS_URL);

  ws.onopen = () => console.log('✅ WebSocket connected for:', username);

  ws.onmessage = (event) => {
    try {
      const data = {
        title: 'New Ticket Assigned!',
        message: event.data,
        ticketId: extractTicketId(event.data),
      };

      onNewTicketCallback(data);
      showLocalNotification(data);
    } catch (error) {
      console.error('WebSocket parsing error:', error);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected. Reconnecting in 5s...');
    setTimeout(() => connectWebSocket(username, onNewTicketCallback), 5000);
  };
}

function showLocalNotification(data) {
  if (isExpoGo) {
    console.log('Expo Go: local notification skipped (works in a dev/standalone build).');
    return;
  }

  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  try {
    Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.message,
        data: { ticketId: data.ticketId },
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('Local notification failed:', e.message);
  }
}

export function disconnectWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

function extractTicketId(message) {
  const match = message.match(/Ticket #(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}