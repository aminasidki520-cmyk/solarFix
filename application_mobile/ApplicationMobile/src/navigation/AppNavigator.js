import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomTabBar from './CustomTabBar';
import DashboardScreen from '../features/dashboard/DashboardScreen';
import TicketDetailScreen from '../features/ticketDetail/TicketDetailScreen';
import CompletionScreen from '../features/completion/CompletionScreen';
import MapScreen from '../screens/MapScreen';
import JobHistoryScreen from '../features/history/JobHistoryScreen';

const Tab = createBottomTabNavigator();
const TodayStack = createNativeStackNavigator();

// "Today" is a stack because Dashboard -> TicketDetail -> Completion is
// one continuous flow (tap a ticket, work it, file the report).
function TodayStackNavigator() {
  return (
    <TodayStack.Navigator screenOptions={{ headerShown: false }}>
      <TodayStack.Screen name="Dashboard" component={DashboardScreen} />
      <TodayStack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <TodayStack.Screen name="Completion" component={CompletionScreen} />
    </TodayStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Today" component={TodayStackNavigator} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="History" component={JobHistoryScreen} />
    
     
    </Tab.Navigator>
  );
}