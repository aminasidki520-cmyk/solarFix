import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { submitReport } from '../../services/reportService';
import { getTicketById } from '../../services/ticketService';
import { colors, radii, spacing, typography, shadow } from '../../theme/theme';

import CompletionHeroHeader from './components/CompletionHeroHeader';
import OutcomeOptionsList from './components/OutcomeOptionsList';
import RepairNotesCard from './components/RepairNotesCard';

export default function CompletionScreen({ route, navigation }) {
  const ticketId = route.params?.ticketId;
  const ticketTitleParam = route.params?.ticketTitle;

  const [ticket, setTicket] = useState(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(!!ticketId);

  const [notes, setNotes] = useState('');
  const [selectedCode, setSelectedCode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!ticketId) return;
    (async () => {
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);
      } catch (err) {
        setTicket(ticketTitleParam ? { ticketId, title: ticketTitleParam } : null);
      } finally {
        setIsLoadingTicket(false);
      }
    })();
  }, [ticketId]);

  const handleSubmit = async () => {
    if (!ticketId) {
      Alert.alert('Missing ticket', 'This screen needs to be opened from a ticket.');
      return;
    }
    if (!selectedCode) {
      Alert.alert('Select an outcome', 'Choose Fixed or Escalate.');
      return;
    }
    if (!notes.trim()) {
      Alert.alert('Add notes', 'Please add a note before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReport(ticketId, { outcome: selectedCode, notes });
      Alert.alert('Submitted', 'Job report sent.');
      navigation.navigate('Dashboard');
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = status ? `(${status}) ${body ? JSON.stringify(body) : err.message}` : err.message;
      console.warn('Report submission failed', err);
      Alert.alert('Submit failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CompletionHeroHeader
        ticket={isLoadingTicket ? null : (ticket ?? { ticketId, title: ticketTitleParam })}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <OutcomeOptionsList selected={selectedCode} onSelect={setSelectedCode} />
        </View>

        <View style={styles.section}>
          <RepairNotesCard value={notes} onChangeText={setNotes} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting} activeOpacity={0.9}>
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Complete Ticket</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.raised,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    minHeight: 56,
    gap: spacing.sm,
  },
  submitButtonText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
});