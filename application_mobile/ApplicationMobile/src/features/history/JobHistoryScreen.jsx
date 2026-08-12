import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyTickets } from '../../services/ticketService';
import { colors, spacing, typography, globalStyles } from '../../theme/theme';

// Helper to format time nicely (e.g., "12 May, 14:30")
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + 
         date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export default function JobHistoryScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getMyTickets();
      
      // 1. Filter: Only show RESOLVED or CLOSED tickets
      const completed = data.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');

      // 2. Sort: Newest FIRST by resolvedAt (or fallback to assignedAt/updatedAt)
      const sorted = completed.sort((a, b) => {
        // Prefer resolvedAt, fallback to assignedAt if resolvedAt is null
        const dateA = a.resolvedAt || a.assignedAt || a.updatedAt;
        const dateB = b.resolvedAt || b.assignedAt || b.updatedAt;
        return new Date(dateB) - new Date(dateA);
      });

      setTickets(sorted);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadHistory();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Job History</Text>
        <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
      </View>
      
      <FlatList
        data={tickets}
        keyExtractor={(item) => String(item.ticketId)}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No completed jobs yet.</Text>
            <Text style={styles.emptySubText}>Finished jobs will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Today', { 
              screen: 'TicketDetail', 
              params: { ticketId: item.ticketId,readOnly: true } 
            })}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-done-circle" size={24} color={colors.success} />
            </View>
            
            <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              {item.reportOutcome && (
                <View style={styles.reportRow}>
                  <Text style={styles.reportOutcome}>{item.reportOutcome}</Text>
                  {item.reportNotes && item.reportNotes.length > 0 && (
                    <Text style={styles.reportNotes} numberOfLines={2}>
                      {item.reportNotes}
                    </Text>
                  )}
                </View>
              )} 
              <Text style={styles.rowMeta}>{item.equipmentLabel || item.location || 'No location'}</Text>
            </View>

            <View style={styles.rightColumn}>
              <Text style={styles.dateText}>
                {formatDate(item.resolvedAt || item.assignedAt)}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: spacing.md, 
    paddingVertical: spacing.md, 
    backgroundColor: colors.white, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border 
  },
  title: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.textPrimary },
  row: {
    ...globalStyles.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  iconContainer: { width: 32, alignItems: 'center' },
  rowTitle: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary },
  rowMeta: { fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: 2 },
  rightColumn: { alignItems: 'flex-end', justifyContent: 'center' },
  dateText: { fontSize: typography.sizes.xs, color: colors.textMuted, marginBottom: 2 },
  empty: { marginTop: 60, alignItems: 'center' },
  emptyText: { marginTop: spacing.md, fontSize: typography.sizes.md, color: colors.textPrimary, fontWeight: '600' },
  emptySubText: { marginTop: spacing.xs, fontSize: typography.sizes.sm, color: colors.textMuted },
   reportRow: { marginTop: 2, marginBottom: 4 },
  reportOutcome: { 
    fontSize: typography.sizes.xs, 
    fontWeight: '700', 
    color: colors.success, 
    marginBottom: 1
  },
  reportNotes: { 
    fontSize: typography.sizes.xs, 
    color: colors.textMuted, 
    fontStyle: 'italic'
  },
});