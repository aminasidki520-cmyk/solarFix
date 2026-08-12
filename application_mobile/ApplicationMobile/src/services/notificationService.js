import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

let ws = null;

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('📱 Expo Push Token:', token);
  return token;
}

export function connectWebSocket(username, onNewTicketCallback) {
  if (ws) return;

  // 🚀 Use your PC's IP address here
  const WS_URL = `ws://192.168.100.140:8082/ws`; 

  ws = new WebSocket(WS_URL);

  ws.onopen = () => console.log('✅ WebSocket connected for:', username);

  ws.onmessage = (event) => {
    try {
      // Backend sends a String, but we want it as an object for navigation
      const data = { 
        title: "New Ticket Assigned!", 
        message: event.data, // Simple string for now
        ticketId: extractTicketId(event.data) // Need logic to pull ID from string
      };
      onNewTicketCallback(data);
      
      Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.message,
          data: { ticketId: data.ticketId },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('WebSocket parsing error:', error);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected. Reconnecting in 5s...');
    setTimeout(() => connectWebSocket(username, onNewTicketCallback), 5000);
  };
}

export function disconnectWebSocket() {
  if (ws) { ws.close(); ws = null; }
}

// Helper to extract ID from your string "Ticket #1234 - Title"
function extractTicketId(message) {
  const match = message.match(/Ticket #(\d+)/);
  return match ? parseInt(match[1]) : null;
}