import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';
import { setUnauthorizedHandler } from '../api/axiosConfig';
import { connectWebSocket, disconnectWebSocket, registerForPushNotificationsAsync } from '../services/notificationService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, role } | null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await authApi.getStoredSession();
      if (session) {
        setUser({ username: session.username, role: session.role });
        await registerForPushNotificationsAsync();
        connectWebSocket(session.username, (newTicketData) => {
          console.log("New ticket detected in background:", newTicketData);
        });
      }
      setIsLoading(false);
    })();

    // Any API call that gets a 401 logs the user out automatically.
    setUnauthorizedHandler(() => {
      disconnectWebSocket();
      setUser(null);
    });
  }, []);

  const login = async (username, password) => {
    try {
      const result = await authApi.login(username, password);

      setUser({ username: result.username, role: result.role });

       await registerForPushNotificationsAsync();
      connectWebSocket(username, (newTicketData) => {
        console.log("New ticket detected:", newTicketData);
      });
      return result;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
     disconnectWebSocket();
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);