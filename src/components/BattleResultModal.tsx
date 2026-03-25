import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { BattleResult, PartInstance } from '../types';
import { getPartDef } from '../data/parts';
import { COLORS } from '../constants/colors';
import { RarityBadge } from './RarityBadge';
import { IconSvg } from './IconSvg';

interface Props {
  visible: boolean;
  result: BattleResult;
  onClose: () => void;
}

// ─── カードコンテンツ（アニメーション付き）──────────────────────────────
function ResultCardContent({ result, onClose }: { result: BattleResult; onClose: () => void }) {
  const rewardDef = result.rewardPart ? getPartDef(result.rewardPart.defId) : null;
  const isWin = result.winner === 'player';

  const resultIcon =
    result.winner === 'player' ? 'party' :
    result.winner === 'enemy' ? 'skull' : 'handshake';

  const resultLabel =
    result.winner === 'player' ? 'YOU WIN!' :
    result.winner === 'enemy' ? 'YOU LOSE...' : 'DRAW';

  // 勝利テキスト: scale 0→1.2→1.0
  const titleScale = useSharedValue(0);
  // 敗北テキスト: opacity 0→1
  const titleOpacity = useSharedValue(isWin ? 1 : 0);
  // ボタン: 2秒後にfadeIn
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    if (isWin) {
      titleScale.value = withSpring(1.2, { damping: 8, stiffness: 300 }, (finished) => {
        if (finished) {
          titleScale.value = withSpring(1.0, { damping: 8, stiffness: 300 });
        }
      });
    } else {
      titleOpacity.value = withTiming(1, { duration: 600 });
    }
    // ボタンは2秒後にfadeIn
    buttonOpacity.value = withDelay(2000, withTiming(1, { duration: 400 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isWin ? titleScale.value : 1 }],
    opacity: isWin ? 1 : titleOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.titleRow, titleStyle]}>
        <IconSvg name={resultIcon} size={32} />
        <Text style={[styles.title, isWin ? styles.titleWin : styles.titleLose]}>
          {resultLabel}
        </Text>
        <IconSvg name={resultIcon} size={32} />
      </Animated.View>

      {isWin && (
        <View style={styles.rewards}>
          <Text style={styles.rewardTitle}>{'報酬:'}</Text>
          {rewardDef && (
            <View style={styles.rewardItem}>
              <IconSvg name="dragon" size={28} />
              <Text style={styles.rewardName}>{rewardDef.name}</Text>
              <RarityBadge rarity={rewardDef.rarity} size="small" />
            </View>
          )}
          <View style={styles.rewardItem}>
            <IconSvg name="coin" size={28} />
            <Text style={styles.coinText}>+{result.coinsEarned} コイン</Text>
          </View>
        </View>
      )}

      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          style={styles.button}
          onPress={onClose}
          accessibilityLabel="バトル結果を閉じる"
          accessibilityRole="button"
        >
          <View style={styles.buttonInner}>
            <IconSvg name="back" size={18} color={COLORS.text.primary} />
            <Text style={styles.buttonText}>{'閉じる'}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export const BattleResultModal: React.FC<Props> = ({ visible, result, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {visible && (
          <ResultCardContent result={result} onClose={onClose} />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: COLORS.bg.overlay,
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  card: {
    backgroundColor: COLORS.bg.secondary, borderRadius: 20, padding: 24,
    width: '100%', alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '900' },
  titleWin: { color: COLORS.text.primary },
  titleLose: { color: COLORS.text.secondary },
  rewards: { width: '100%', marginBottom: 16 },
  rewardTitle: { color: COLORS.text.secondary, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  rewardItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  rewardName: { color: COLORS.text.primary, fontSize: 14, flex: 1 },
  coinText: { color: COLORS.ui.warning, fontSize: 14, fontWeight: '700' },
  button: {
    backgroundColor: COLORS.ui.accent, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12,
    minHeight: 44,
  },
  buttonInner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  buttonText: { color: COLORS.text.primary, fontSize: 16, fontWeight: '700' },
});
