import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stats } from '../types';
import { COLORS } from '../constants/colors';

interface Props {
  stats: Stats;
  compact?: boolean;
}

export const StatsBar: React.FC<Props> = ({ stats, compact = false }) => {
  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Text style={[styles.compactStat, { color: COLORS.stat.atk }]}>ATK:{stats.atk}</Text>
        <Text style={[styles.compactStat, { color: COLORS.stat.hp }]}>HP:{stats.hp}</Text>
        <Text style={[styles.compactStat, { color: COLORS.stat.spd }]}>SPD:{stats.spd}</Text>
      </View>
    );
  }

  const maxStat = Math.max(stats.atk, stats.hp, stats.spd, 1);

  return (
    <View style={styles.container}>
      <StatRow label="ATK" value={stats.atk} maxValue={maxStat} color={COLORS.stat.atk} />
      <StatRow label="HP" value={stats.hp} maxValue={maxStat} color={COLORS.stat.hp} />
      <StatRow label="SPD" value={stats.spd} maxValue={maxStat} color={COLORS.stat.spd} />
    </View>
  );
};

const StatRow: React.FC<{ label: string; value: number; maxValue: number; color: string }> = ({
  label, value, maxValue, color,
}) => (
  <View style={styles.row}>
    <Text style={[styles.label, { color }]}>{label}</Text>
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${(value / maxValue) * 100}%`, backgroundColor: color }]} />
    </View>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { width: 32, fontSize: 11, fontWeight: '700' },
  barBg: { flex: 1, height: 8, backgroundColor: COLORS.bg.surface, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  value: { width: 32, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  compactRow: { flexDirection: 'row', gap: 8 },
  compactStat: { fontSize: 10, fontWeight: '700' },
});
