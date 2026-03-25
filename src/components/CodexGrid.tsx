import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PartDef, PartSpecies, RARITY_COLOR, RARITY_LABEL } from '../types';
import { PARTS_DATA } from '../data/parts';
import { COLORS } from '../constants/colors';

interface Props {
  discovered: string[];
  onSelectPart?: (def: PartDef) => void;
}

const SPECIES_ORDER: { key: PartSpecies; label: string }[] = [
  { key: 'dragon', label: 'ドラゴン系' },
  { key: 'phoenix', label: 'フェニックス系' },
  { key: 'kraken', label: 'クラーケン系' },
];

const TYPES_ORDER = ['head', 'body', 'legs'] as const;

export const CodexGrid: React.FC<Props> = ({ discovered, onSelectPart }) => {
  const total = PARTS_DATA.length;
  const found = discovered.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {'\u9032\u6357'}: {found}/{total} ({Math.round((found / total) * 100)}%)
        </Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(found / total) * 100}%` }]} />
        </View>
      </View>

      {SPECIES_ORDER.map(species => (
        <View key={species.key} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {species.label}
          </Text>
          {TYPES_ORDER.map(type => {
            const parts = PARTS_DATA.filter(
              p => p.species === species.key && p.type === type
            ).sort((a, b) => {
              const ra = ['common', 'uncommon', 'rare', 'epic', 'legendary'].indexOf(a.rarity);
              const rb = ['common', 'uncommon', 'rare', 'epic', 'legendary'].indexOf(b.rarity);
              return ra - rb;
            });

            return (
              <View key={type} style={styles.typeRow}>
                {parts.map(part => {
                  const isDiscovered = discovered.includes(part.id);
                  return (
                    <TouchableOpacity
                      key={part.id}
                      style={[
                        styles.codexCell,
                        { borderColor: isDiscovered ? RARITY_COLOR[part.rarity] : COLORS.ui.border },
                      ]}
                      onPress={() => isDiscovered && onSelectPart?.(part)}
                      activeOpacity={isDiscovered ? 0.7 : 1}
                    >
                      <Text style={[styles.cellEmoji, !isDiscovered && styles.undiscovered]}>
                        {isDiscovered ? part.emoji : '\u2753'}
                      </Text>
                      <Text style={[styles.cellRarity, { color: RARITY_COLOR[part.rarity] }]}>
                        {part.rarity[0].toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressContainer: { padding: 16 },
  progressText: { color: COLORS.text.secondary, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  progressBarBg: { height: 8, backgroundColor: COLORS.bg.surface, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.ui.accent, borderRadius: 4 },
  section: { marginBottom: 16, paddingHorizontal: 16 },
  sectionTitle: { color: COLORS.text.primary, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  codexCell: {
    width: 56, height: 64, backgroundColor: COLORS.bg.surface, borderRadius: 8,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  cellEmoji: { fontSize: 24 },
  undiscovered: { opacity: 0.3 },
  cellRarity: { fontSize: 10, fontWeight: '700', marginTop: 2 },
});
