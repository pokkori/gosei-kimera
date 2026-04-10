import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Share, Linking } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BattleResult, PartInstance } from '../types';
import { getPartDef } from '../data/parts';
import { COLORS } from '../constants/colors';
import { RarityBadge } from './RarityBadge';
import { IconSvg } from './IconSvg';
import { useRewardedAd } from '../hooks/useRewardedAd';

interface Props {
  visible: boolean;
  result: BattleResult;
  onClose: () => void;
}

// ─── カードコンテンツ（アニメーション付き）──────────────────────────────
function ResultCardContent({ result, onClose }: { result: BattleResult; onClose: () => void }) {
  const rewardDef = result.rewardPart ? getPartDef(result.rewardPart.defId) : null;
  const isWin = result.winner === 'player';
  const { isLoaded: adLoaded, showAd } = useRewardedAd();

  const handleShare = useCallback(async () => {
    const r = isWin ? '勝利' : result.winner === 'enemy' ? '敗北' : '引き分け';
    const msg = `合成キメラ バトル${r}！ +${result.coinsEarned}コイン獲得 #合成キメラ`;
    try { await Share.share({ message: msg }); } catch (_) {}
  }, [isWin, result]);

  const handleShareX = useCallback(async () => {
    const r = isWin ? '勝利' : result.winner === 'enemy' ? '敗北' : '引き分け';
    const msg = encodeURIComponent(`合成キメラ バトル${r}！ +${result.coinsEarned}コイン獲得 #合成キメラ`);
    await Linking.openURL(`https://twitter.com/intent/tweet?text=${msg}`);
  }, [isWin, result]);

  const handleWatchAd = useCallback(() => {
    showAd(() => {
      // Bonus coins from ad
    });
  }, [showAd]);

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
    // 勝敗モーダル表示時のハプティクス
    if (result.winner === 'player') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else if (result.winner === 'enemy') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }

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

      {/* Share & Ad */}
      <View style={styles.shareRow}>
        <Pressable style={styles.shareBtn} onPress={handleShare} accessibilityRole="button" accessibilityLabel="結果をシェアする">
          <Text style={styles.shareBtnText}>シェア</Text>
        </Pressable>
        <Pressable style={styles.xBtn} onPress={handleShareX} accessibilityRole="button" accessibilityLabel="Xに投稿する">
          <Text style={styles.xBtnText}>Xに投稿</Text>
        </Pressable>
        {adLoaded && (
          <Pressable style={styles.adBtn} onPress={handleWatchAd} accessibilityRole="button" accessibilityLabel="広告を見てボーナスを獲得する">
            <Text style={styles.adBtnText}>広告でボーナス</Text>
          </Pressable>
        )}
      </View>

      <Animated.View style={buttonStyle}>
        <Pressable
          style={styles.button}
          onPress={onClose}
          accessibilityLabel="バトル結果を閉じる"
          accessibilityRole="button"
        >
          <View style={styles.buttonInner}>
            <IconSvg name="back" size={18} color={COLORS.text.primary} />
            <Text style={styles.buttonText}>{'閉じる'}</Text>
          </View>
        </Pressable>
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
  shareRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  shareBtn: { backgroundColor: COLORS.ui.accent, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, minHeight: 44, justifyContent: 'center' },
  shareBtnText: { color: COLORS.text.primary, fontSize: 13, fontWeight: '700' },
  xBtn: { backgroundColor: '#000', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, minHeight: 44, justifyContent: 'center' },
  xBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  adBtn: { backgroundColor: '#FFB300', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, minHeight: 44, justifyContent: 'center' },
  adBtnText: { color: '#1A1A2E', fontSize: 13, fontWeight: '700' },
});
