// src/services/notificationsCompat.js
//
// Single source of truth for accessing expo-notifications safely.
// Every other file in the app should go through this module instead
// of importing 'expo-notifications' directly — that way the Expo Go
// guard only needs to live in one place.

import Constants from 'expo-constants';

export const isExpoGo = Constants.executionEnvironment === 'storeClient';

let _Notifications = null;

/**
 * Returns the expo-notifications module, or null if running in Expo Go
 * (where Android push functionality was removed in SDK 53+).
 * Safe to call as many times as you want — it caches the require().
 */
export function getNotificationsModule() {
  if (isExpoGo) return null;

  if (!_Notifications) {
    _Notifications = require('expo-notifications');
  }
  return _Notifications;
}