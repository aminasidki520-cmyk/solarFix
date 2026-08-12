import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Linking, ActivityIndicator, Alert } from 'react-native';
import { getTicketById, startWork } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme/theme';

import TicketTopBar from './components/TicketTopBar';
import TicketHeroCard from './components/TicketHeroCard';
import DescriptionCard from './components/DescriptionCard';
import TicketTimeline from './components/TicketTimeline';
import StickyActionBar from './components/StickyActionBar';

// Only uses fields that actually exist on TechnicianTicketDTO: title,
// priority, status, location, equipmentLabel, assignedAt, description,
// latitude, longitude. Nothing fabricated.

export default function TicketDetailScreen({ route, navigation }) {
  const { ticketId , readOnly = false} = route.params;
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStartingWork, setIsStartingWork] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.response?.status === 403 ? 'Not assigned to you.' : 'Could not load this ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  const openInMaps = () => {
    if (ticket?.latitude != null && ticket?.longitude != null) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${ticket.latitude},${ticket.longitude}`);
    } else {
      Alert.alert('No location', 'This ticket has no coordinates.');
    }
  };

  const handleStartWork = async () => {
    setIsStartingWork(true);
    try {
      // Direct update — no admin approval needed for this step, since the
      // admin already approved this technician for this ticket earlier.
      await startWork(ticketId);
      await loadTicket(); // refresh so the status pill/timeline update immediately
      Alert.alert('Work started', 'This ticket is now marked as In Progress.');
    } catch (err) {
      const message = err.response?.data ? String(err.response.data) : 'Could not start work on this ticket.';
      Alert.alert('Could not start work', message);
    } finally {
      setIsStartingWork(false);
    }
  };

  const handleCompleteJob = () => {
    navigation.navigate('Completion', { ticketId, ticketTitle: ticket?.title });
  };

  const initials = (user?.username ?? '?').slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !ticket) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error ?? 'Ticket not found.'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TicketTopBar onBack={() => navigation.goBack()} initials={initials} onBellPress={() => {}} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TicketHeroCard ticket={ticket} onOpenMaps={openInMaps} />
        {ticket.reportOutcome && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Technician Report</Text>
            <View style={styles.reportContainer}>
              <View style={[
                styles.outcomeBadge, 
                { backgroundColor: ticket.reportOutcome === 'FIXED' ? colors.successLight : colors.warningLight }
              ]}>
                <Text style={[
                  styles.outcomeText, 
                  { color: ticket.reportOutcome === 'FIXED' ? colors.success : colors.warning }
                ]}>
                  {ticket.reportOutcome}
                </Text>
              </View>
              {ticket.reportNotes && (
                <Text style={styles.reportNotes}>{ticket.reportNotes}</Text>
              )}
            </View>
          </View>
        )}


        <View style={styles.section}>
          <DescriptionCard description={ticket.description} />
        </View>

        <View style={styles.section}>
          <TicketTimeline ticket={ticket} />
        </View>
      </ScrollView>

      <StickyActionBar readOnly={readOnly} onStartWork={handleStartWork} onCompleteJob={handleCompleteJob} isStartingWork={isStartingWork} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: spacing.xxl },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  errorText: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md, paddingHorizontal: spacing.xl, fontSize: typography.sizes.md },
  backLinkText: { color: colors.primary, fontWeight: typography.weights.semibold },
   reportContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  outcomeBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  outcomeText: {
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  reportNotes: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 20,
  }

});