import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui';
import { colors, spacing, typography } from '../../../theme/theme';

// ⚠️ TechnicianTicketDTO has no `createdAt` or update-history fields, so
// this timeline only uses what's actually available: `assignedAt` (real
// timestamp) and `status` (used to infer how far along the ticket is).
// No fabricated "Ticket created" step, no invented backend fields.
function buildSteps(ticket) {
  const steps = [
    { key: 'assigned', label: 'Assigned to you', time: formatDateTime(ticket.assignedAt), done: true },
  ];

  const inProgress = ['IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(ticket.status);
  const completed = ['RESOLVED', 'CLOSED'].includes(ticket.status);

  if (inProgress) {
    steps.push({ key: 'progress', label: 'In progress', time: completed ? null : 'Now', done: true });
  }
  if (completed) {
    steps.push({ key: 'completed', label: 'Completed', time: 'Now', done: true });
  }

  return steps;
}

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function TicketTimeline({ ticket }) {
  const steps = buildSteps(ticket);

  return (
    <Card>
      <Text style={styles.title}>Timeline</Text>
      {steps.map((step, i) => (
        <View key={step.key} style={styles.row}>
          <View style={styles.dotColumn}>
            <View style={styles.dot} />
            {i < steps.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.label}>{step.label}</Text>
            {step.time && <Text style={styles.time}>{step.time}</Text>}
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.textPrimary, marginBottom: spacing.md },
  row: { flexDirection: 'row' },
  dotColumn: { width: 18, alignItems: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, marginTop: 4 },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 2, minHeight: 20 },
  textBlock: { flex: 1, marginLeft: spacing.md, paddingBottom: spacing.md },
  label: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.textPrimary },
  time: { fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: 2 },
});
