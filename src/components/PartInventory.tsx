import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { PartInstance, PartType, RARITY_INDEX } from '../types';
import { getPartDef } from '../data/parts';
import { COLORS } from '../constants/colors';
import { PartCard } from './PartCard';

interface Props {
  inventory: PartInstance[];
  selectedIds: string[];
  onSelectPart: (instanceId: string) => void;
  inventoryLimit: number;
}

type FilterType = 'all' | PartType;

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '\u5168\u3066' },
  { key: 'head', label: '頭' },
  { key: 'body', label: '胴' },
  { key: 'legs', label: '脚' },
];

export const PartInventory: React.FC<Props> = ({ inventory, selectedIds, onSelectPart, inventoryLimit }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredParts = useMemo(() => {
    let parts = inventory.map(inst => ({
      instance: inst,
      def: getPartDef(inst.defId),
    })).filter(p => p.def != null);

    if (filter !== 'all') {
      parts = parts.filter(p => p.def!.type === filter);
    }

    parts.sort((a, b) => {
      const ra = RARITY_INDEX[a.def!.rarity];
      const rb = RARITY_INDEX[b.def!.rarity];
      if (rb !== ra) return rb - ra;
      return new Date(b.instance.acquiredAt).getTime() - new Date(a.instance.acquiredAt).getTime();
    });

    return parts;
  }, [inventory, filter]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {'\u30A4\u30F3\u30D9\u30F3\u30C8\u30EA'} {inventory.length}/{inventoryLimit}
        </Text>
      </View>
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredParts}
        keyExtractor={item => item.instance.instanceId}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PartCard
            partDef={item.def!}
            selected={selectedIds.includes(item.instance.instanceId)}
            onPress={() => onSelectPart(item.instance.instanceId)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {filter === 'all'
              ? '\u90E8\u4F4D\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u95D8\u6280\u5834\u3067\u6226\u3063\u3066\u5165\u624B\u3057\u3088\u3046\uFF01'
              : '\u3053\u306E\u30BF\u30A4\u30D7\u306E\u90E8\u4F4D\u306F\u3042\u308A\u307E\u305B\u3093'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  title: {
    color: COLORS.text.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.bg.surface,
  },
  filterActive: {
    backgroundColor: COLORS.ui.accent,
  },
  filterText: {
    color: COLORS.text.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.text.primary,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
  emptyText: {
    color: COLORS.text.muted,
    fontSize: 12,
    paddingVertical: 20,
  },
});
