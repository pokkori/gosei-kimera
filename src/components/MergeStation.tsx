import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { PartInstance } from '../types';
import { COLORS } from '../constants/colors';
import { canMerge } from '../engine/merge';
import { getPartDef } from '../data/parts';

interface Props {
  onMerge: (id1: string, id2: string) => void;
  slot1?: PartInstance | null;
  slot2?: PartInstance | null;
  onClearSlot: (slot: 1 | 2) => void;
}

// ─── 合成成功セレブレーションオーバーレイ ───────────────────────────────
function MergeCelebration({ visible }: { visible: boolean }) {
  // 中央アイコン: scale 0→1.4→1.0
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  // 金色リング拡大: scale 1→2, opacity 1→0
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (!visible) {
      scale.value = 0;
      opacity.value = 0;
      ringScale.value = 1;
      ringOpacity.value = 0;
      return;
    }
    // 中央アイコン
    opacity.value = withTiming(1, { duration: 100 });
    scale.value = withSpring(1.4, { damping: 6, stiffness: 300 }, (finished) => {
      if (finished) {
        scale.value = withSpring(1.0, { damping: 8, stiffness: 300 });
      }
    });
    // 金色リング
    ringOpacity.value = withTiming(1, { duration: 80 });
    ringScale.value = withTiming(2.0, { duration: 600 }, () => {
      ringOpacity.value = withTiming(0, { duration: 200 });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const celebStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={celebStyles.overlay} pointerEvents="none">
      {/* 金色リング */}
      <Animated.View style={[celebStyles.ring, ringStyle]} />
      {/* 合成成功テキスト */}
      <Animated.View style={[celebStyles.successBox, celebStyle]}>
        <Text style={celebStyles.successText}>合成成功!</Text>
      </Animated.View>
    </View>
  );
}

const celebStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFD93D',
  },
  successBox: {
    backgroundColor: 'rgba(255,217,61,0.18)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  successText: {
    color: '#FFD93D',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

// ─── MergeStation メイン ────────────────────────────────────────────────
export const MergeStation: React.FC<Props> = ({ onMerge, slot1, slot2, onClearSlot }) => {
  const def1 = slot1 ? getPartDef(slot1.defId) : null;
  const def2 = slot2 ? getPartDef(slot2.defId) : null;
  const canDoMerge = def1 && def2 && canMerge(def1, def2);
  const [showCelebration, setShowCelebration] = useState(false);

  // 合成ボタンアニメーション
  const mergeButtonScale = useSharedValue(1);

  const mergeButtonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mergeButtonScale.value }],
  }));

  const handleMerge = useCallback(() => {
    if (slot1 && slot2 && canDoMerge) {
      // 合成ボタン押下アニメーション
      mergeButtonScale.value = withSequence(
        withSpring(0.9, { damping: 10, stiffness: 400 }),
        withSpring(1.0, { damping: 10, stiffness: 400 }),
      );
      onMerge(slot1.instanceId, slot2.instanceId);
      // 合成成功セレブレーション
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 900);
    } else if (def1 && def2) {
      Alert.alert(
        '合成不可',
        '同じ種類・レア度の部位が必要！',
      );
    }
  }, [slot1, slot2, canDoMerge, def1, def2, onMerge, mergeButtonScale]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'マージ台'}</Text>
      <View style={styles.slotsRow}>
        <TouchableOpacity
          style={[styles.mergeSlot, slot1 && styles.mergeSlotFilled]}
          onPress={() => slot1 && onClearSlot(1)}
          accessibilityRole="button"
          accessibilityLabel={def1 ? `スロット1: ${def1.name}。タップで解除` : 'スロット1: 空き'}
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
          accessibilityRole="button"
          accessibilityLabel={def2 ? `スロット2: ${def2.name}。タップで解除` : 'スロット2: 空き'}
        >
          {def2 ? (
            <Text style={styles.slotEmoji}>{def2.emoji}</Text>
          ) : (
            <Text style={styles.slotPlaceholder}>2</Text>
          )}
        </TouchableOpacity>

        <Animated.View style={mergeButtonAnimStyle}>
          <TouchableOpacity
            style={[styles.mergeButton, canDoMerge && styles.mergeButtonActive]}
            onPress={handleMerge}
            disabled={!slot1 || !slot2}
            accessibilityRole="button"
            accessibilityLabel="合成を実行する"
            accessibilityState={{ disabled: !slot1 || !slot2 }}
          >
            <Text style={styles.mergeButtonText}>{'合成!'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {def1 && def2 && !canDoMerge && (
        <Text style={styles.errorText}>
          {def1.rarity === 'legendary'
            ? 'これ以上は進化できない'
            : '同じ種類・レア度が必要'}
        </Text>
      )}

      {/* 合成成功セレブレーション */}
      <MergeCelebration visible={showCelebration} />
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
    minHeight: 44,
    justifyContent: 'center',
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
