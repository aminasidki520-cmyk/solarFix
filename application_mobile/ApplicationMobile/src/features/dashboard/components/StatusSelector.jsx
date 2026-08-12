import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, StatusChip } from '../../../components/ui';

// counts: { ASSIGNED: number, PROGRESS: number, WAITING: number, COMPLETED: number }
export default function StatusSelector({ tabs, counts, activeKey, onChange }) {
  return (
    <Card padding={4} style={styles.card}>
      <View style={styles.row}>
        {tabs.map((tab) => (
          <StatusChip
            key={tab.key}
            icon={tab.icon}
            count={counts[tab.key] ?? 0}
            label={tab.label}
            isActive={tab.key === activeKey}
            onPress={() => onChange(tab.key)}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  row: { flexDirection: 'row' },
});
