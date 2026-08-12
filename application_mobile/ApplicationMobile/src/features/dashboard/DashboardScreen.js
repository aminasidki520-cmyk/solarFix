import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import { getMyTickets } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';

import GreetingHeader from './components/GreetingHeader';
import StatusSelector from './components/StatusSelector';
import NextJobCard from './components/NextJobCard';
import ProgressCard from './components/ProgressCard';
import UpcomingTicketsList from './components/UpcomingTicketsList';

const TABS = [
  { key: 'ASSIGNED', label: 'Assigned', icon: 'briefcase-outline', match: (s) => s === 'ASSIGNED' || s === 'OPEN' },
  { key: 'PROGRESS', label: 'In Progress', icon: 'sync-outline', match: (s) => s === 'IN_PROGRESS' },

  { key: 'COMPLETED', label: 'Completed', icon: 'checkmark-circle-outline', match: (s) => s === 'RESOLVED' || s === 'CLOSED' },
];

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ASSIGNED');
  const PRIORITY_WEIGHTS = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  const loadTickets = useCallback(async () => {
    try {
      setError(null);
      const data = await getMyTickets();
      setTickets(data);
    } catch (err) {
      setError(err.response?.status === 403 ? 'Access denied — check your technician role.' : 'Could not load tickets.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadTickets();
  };

  const counts = useMemo(() => {
    const result = {};
    TABS.forEach((tab) => {
      result[tab.key] = tickets.filter((t) => tab.match(t.status)).length;
    });
    return result;
  }, [tickets]);

  const currentTab = TABS.find((t) => t.key === activeFilter);
  const filteredTickets = useMemo(
    () => tickets.filter((t) => currentTab.match(t.status)),
    [tickets, currentTab]
  );

  const completedCount = counts.COMPLETED ?? 0;
  const totalCount = tickets.length;

  const currentTicket = filteredTickets[0];
  
 //  SORT UPCOMING TICKETS BY PRIORITY (Critical first, then High, Medium, Low)
  const upcomingTickets = filteredTickets
    .slice(1) // Remove the first ticket (already used in "Your Next Job")
    .sort((a, b) => {
      // Get the weight of each ticket, default to 3 (LOW) if priority is somehow missing
      const weightA = PRIORITY_WEIGHTS[a.priority] ?? 3;
      const weightB = PRIORITY_WEIGHTS[b.priority] ?? 3;
      return weightA - weightB; // Lower number sorts first
    })
    .slice(0, 3); // Take the top 3 after sorting

  const displayName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'there';
  const initials = (user?.username ?? '?').slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GreetingHeader name={displayName} initials={initials} notificationCount={counts.WAITING} onBellPress={() => {}} />

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadTickets}>
            <Text style={styles.retryLink}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.section}>
          <StatusSelector tabs={TABS} counts={counts} activeKey={activeFilter} onChange={setActiveFilter} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your Next Job</Text>
          <NextJobCard
            ticket={currentTicket}
            onPress={() => currentTicket && navigation.navigate('TicketDetail', { ticketId: currentTicket.ticketId })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Today's Progress</Text>
          <ProgressCard completedCount={completedCount} totalCount={totalCount} />
        </View>

        {upcomingTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Upcoming Tickets</Text>
            <UpcomingTicketsList
              tickets={upcomingTickets}
              onSelect={(t) => navigation.navigate('TicketDetail', { ticketId: t.ticketId })}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: spacing.xxl },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    marginHorizontal: spacing.lg,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: { color: colors.danger, flex: 1, fontSize: typography.sizes.sm },
  retryLink: { color: colors.danger, fontWeight: typography.weights.bold, marginLeft: spacing.sm },
});