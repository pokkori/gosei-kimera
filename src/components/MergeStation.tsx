import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { PartInstance, PartDef } from '../types';
import { COLORS } from '../constants/colors';
import { canMerge } from '../engine/merge';
import { getPartDef } from '../data/parts';
import { PartCard } from './PartCard';

interface Props {
  onMerge: (id1: string, id2: string) => void;
  slot1?: PartInstance | null;
  slot2?: PartInstance | null;
  onClearSlot: (slot: 1 | 2) => void;
}

export const MergeStation: React.FC<Props> = ({ onMerge, slot1, slot2, onClearSlot }) => {
  const def1 = slot1 ? getPartDef(slot1.defId) : null;
  const def2 = slot2 ? getPartDef(slot2.defId) : null;

  const canDoMerge = def1 && def2 && canMerge(def1, def2);

  const handleMerge = () => {
    if (slot1 && slot2 && canDoMerge) {
      onMerge(slot1.instanceId, slot2.instanceId);
    } else if (def1 && def2) {
      Alert.alert(
        '\u5408\u6210\u4E0D\u53EF',
        '\u540C\u3058\u7A2E\u985E\u30FB\u30EC\u30A2\u5EA6\u306E\u90E8\u4F4D\u304C\u5FC5\u8981\uFF01'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'\u2697\uFE0F \u30DE\u30FC\u30B8\u53F0'}</Text>
      <View style={styles.slotsRow}>
        <TouchableOpacity
          style={[styles.mergeSlot, slot1 && styles.mergeSlotFilled]}
          onPress={() => slot1 && onClearSlot(1)}
        >
          {def1 ? (
            <Text style={styles.slotEmoji}>{def1.emoji}</Text>
          ) : (
            <Text style={styles.slotPlaceholder}>1</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.plus}>+</Text>

        <TouchableOpacity
          style={[styles.mergeSlot, slot2 && styles.mergeSlotFilled]}
          onPress={() => slot2 && onClearSlot(2)}
        >
          {def2 ? (
            <Text style={styles.slotEmoji}>{def2.emoji}</Text>
          ) : (
            <Text style={styles.slotPlaceholder}>2</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mergeButton, canDoMerge && styles.mergeButtonActive]}
          onPress={handleMerge}
          disabled={!slot1 || !slot2}
        >
          <Text style={styles.mergeButtonText}>{'\u5408\u6210\uFF01'}</Text>
        </TouchableOpacity>
      </View>
      {def1 && def2 && !canDoMerge && (
        <Text style={styles.errorText}>
          {def1.rarity === 'legendary'
            ? '\u3053\u308C\u4EE5\u4E0A\u306F\u9032\u5316\u3067\u304D\u306A\u3044'
            : '\u540C\u3058\u7A2E\u985E\u30FB\u30EC\u30A2\u5EA6\u304C\u5FC5\u8981'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mergeSlot: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.bg.primary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.ui.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mergeSlotFilled: {
    borderStyle: 'solid',
    borderColor: COLORS.ui.accent,
  },
  slotEmoji: {
    fontSize: 28,
  },
  slotPlaceholder: {
    color: COLORS.text.muted,
    fontSize: 18,
    fontWeight: '700',
  },
  plus: {
    color: COLORS.text.muted,
    fontSize: 20,
    fontWeight: '700',
  },
  mergeButton: {
    backgroundColor: COLORS.ui.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  mergeButtonActive: {
    backgroundColor: COLORS.ui.accent,
  },
  mergeButtonText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.ui.error,
    fontSize: 11,
    marginTop: 4,
  },
});
