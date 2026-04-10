import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PartDef, RARITY_COLOR } from '../types';
import { COLORS } from '../constants/colors';
import { IconSvg } from './IconSvg';

const PART_TYPE_ICON = { head: 'head', body: 'body', legs: 'legs' } as const;

interface Props {
  partDef: PartDef;
  onPress?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  size?: 'small' | 'normal';
}

export const PartCard: React.FC<Props> = ({ partDef, onPress, onLongPress, selected, size = 'normal' }) => {
  const borderColor = RARITY_COLOR[partDef.rarity];
  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        isSmall && styles.cardSmall,
        { borderColor: selected ? COLORS.ui.accent : borderColor },
        selected && styles.selected,
      ]}
    >
      <IconSvg
        name={PART_TYPE_ICON[partDef.type] ?? 'dragon'}
        size={isSmall ? 20 : 28}
        color={RARITY_COLOR[partDef.rarity]}
      />
      <Text style={[styles.name, isSmall && styles.nameSmall]} numberOfLines={1}>
        {partDef.name}
      </Text>
      <View style={[styles.rarityDot, { backgroundColor: borderColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 72,
    height: 96,
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  cardSmall: {
    width: 56,
    height: 72,
  },
  selected: {
    shadowColor: COLORS.ui.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  emoji: {
    fontSize: 28,
  },
  emojiSmall: {
    fontSize: 20,
  },
  name: {
    color: COLORS.text.primary,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  nameSmall: {
    fontSize: 7,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
});
