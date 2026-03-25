import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rarity, RARITY_COLOR, RARITY_LABEL } from '../types';

interface Props {
  rarity: Rarity;
  size?: 'small' | 'normal';
}

export const RarityBadge: React.FC<Props> = ({ rarity, size = 'normal' }) => {
  const color = RARITY_COLOR[rarity];
  const isSmall = size === 'small';
  return (
    <View style={[styles.badge, { backgroundColor: color + '33', borderColor: color }, isSmall && styles.small]}>
      <Text style={[styles.text, { color }, isSmall && styles.smallText]}>
        {RARITY_LABEL[rarity]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  small: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  smallText: {
    fontSize: 9,
  },
});
