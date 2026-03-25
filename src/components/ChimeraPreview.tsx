import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PartDef, Rarity, RARITY_COLOR } from '../types';
import { COLORS } from '../constants/colors';

interface Props {
  headDef: PartDef | null;
  bodyDef: PartDef | null;
  legsDef: PartDef | null;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: { width: 80, height: 106, emoji: 24 },
  medium: { width: 160, height: 213, emoji: 40 },
  large: { width: 240, height: 320, emoji: 56 },
};

function getHighestRarity(...defs: (PartDef | null)[]): Rarity {
  const rarityOrder: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  let highest = 0;
  for (const def of defs) {
    if (def) {
      const idx = rarityOrder.indexOf(def.rarity);
      if (idx > highest) highest = idx;
    }
  }
  return rarityOrder[highest];
}

export const ChimeraPreview: React.FC<Props> = ({ headDef, bodyDef, legsDef, size = 'large' }) => {
  const dim = SIZES[size];
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [floatY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const hasAny = headDef || bodyDef || legsDef;
  const highestRarity = getHighestRarity(headDef, bodyDef, legsDef);
  const glowColor = RARITY_COLOR[highestRarity];

  return (
    <Animated.View style={[styles.container, { width: dim.width, height: dim.height }, floatStyle]}>
      {hasAny && (
        <View style={[styles.aura, { shadowColor: glowColor }]} />
      )}
      <View style={styles.partsColumn}>
        <View style={styles.partSection}>
          {headDef ? (
            <Text style={{ fontSize: dim.emoji }}>{headDef.emoji}</Text>
          ) : (
            <Text style={[styles.placeholder, { fontSize: dim.emoji * 0.6 }]}>?</Text>
          )}
        </View>
        <View style={styles.partSection}>
          {bodyDef ? (
            <Text style={{ fontSize: dim.emoji }}>{bodyDef.emoji}</Text>
          ) : (
            <Text style={[styles.placeholder, { fontSize: dim.emoji * 0.6 }]}>?</Text>
          )}
        </View>
        <View style={styles.partSection}>
          {legsDef ? (
            <Text style={{ fontSize: dim.emoji }}>{legsDef.emoji}</Text>
          ) : (
            <Text style={[styles.placeholder, { fontSize: dim.emoji * 0.6 }]}>?</Text>
          )}
        </View>
      </View>
      {!hasAny && (
        <Text style={styles.emptyText}>{'\u90E8\u4F4D\u3092\u88C5\u5099\u3057\u3088\u3046\uFF01'}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  aura: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  partsColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: -8,
  },
  partSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    color: COLORS.text.muted,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.text.muted,
    fontSize: 12,
    marginTop: 8,
  },
});
