import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SlotType, PartDef, RARITY_COLOR } from '../types';
import { COLORS } from '../constants/colors';

interface Props {
  slot: SlotType;
  partDef: PartDef | null;
  onPress?: () => void;
  onLongPress?: () => void;
  highlighted?: boolean;
}

const SLOT_LABELS: Record<SlotType, { icon: string; label: string; stat: string }> = {
  head: { icon: '\u{1F5E1}', label: 'HEAD', stat: 'ATK' },
  body: { icon: '\u{1F6E1}', label: 'BODY', stat: 'HP' },
  legs: { icon: '\u{1F9B6}', label: 'LEGS', stat: 'SPD' },
};

export const PartSlot: React.FC<Props> = ({ slot, partDef, onPress, onLongPress, highlighted }) => {
  const slotInfo = SLOT_LABELS[slot];
  const borderColor = partDef ? RARITY_COLOR[partDef.rarity] : COLORS.ui.border;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.slot,
        { borderColor },
        highlighted && styles.highlighted,
      ]}
    >
      {partDef ? (
        <>
          <Text style={styles.emoji}>{partDef.emoji}</Text>
          <Text style={styles.partName} numberOfLines={1}>{partDef.name}</Text>
          <Text style={styles.statBonus}>{slotInfo.stat}+{
            slot === 'head' ? Math.floor(partDef.stats.atk * 1.5) :
            slot === 'body' ? Math.floor(partDef.stats.hp * 1.5) :
            Math.floor(partDef.stats.spd * 1.5)
          }</Text>
        </>
      ) : (
        <>
          <Text style={styles.icon}>{slotInfo.icon}</Text>
          <Text style={styles.label}>{slotInfo.label}</Text>
          <Text style={styles.hint}>Tap to equip</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slot: {
    width: 90,
    height: 110,
    backgroundColor: COLORS.bg.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  highlighted: {
    borderColor: COLORS.ui.accent,
    borderStyle: 'solid',
    shadowColor: COLORS.ui.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: { fontSize: 28 },
  partName: { color: COLORS.text.primary, fontSize: 8, marginTop: 2, textAlign: 'center' },
  statBonus: { color: COLORS.ui.accentLight, fontSize: 10, fontWeight: '700', marginTop: 2 },
  icon: { fontSize: 24 },
  label: { color: COLORS.text.muted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  hint: { color: COLORS.text.muted, fontSize: 8, marginTop: 2 },
});
