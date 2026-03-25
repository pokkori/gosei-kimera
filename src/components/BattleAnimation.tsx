import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { BattleResult, Stats } from '../types';
import { COLORS } from '../constants/colors';
import { IconSvg } from './IconSvg';

interface Props {
  playerName: string;
  playerEmoji: string;
  playerStats: Stats;
  enemyName: string;
  enemyEmoji: string;
  enemyStats: Stats;
  result: BattleResult;
  onComplete: () => void;
}

export const BattleAnimation: React.FC<Props> = ({
  playerName, playerEmoji, playerStats,
  enemyName, enemyEmoji, enemyStats,
  result, onComplete,
}) => {
  const [currentTurnIdx, setCurrentTurnIdx] = useState(-1);
  const [playerHp, setPlayerHp] = useState(playerStats.hp);
  const [enemyHp, setEnemyHp] = useState(enemyStats.hp);
  const [showResult, setShowResult] = useState(false);
  const [damageText, setDamageText] = useState<{ text: string; side: 'left' | 'right' } | null>(null);

  // 攻撃移動: プレイヤー横移動 (パンチ感)
  const playerX = useSharedValue(0);
  // 攻撃移動: 敵横移動
  const enemyX = useSharedValue(0);
  const playerHpWidth = useSharedValue(100);
  const enemyHpWidth = useSharedValue(100);

  // ダメージシェイク用 SharedValue
  const playerShakeX = useSharedValue(0);
  const enemyShakeX = useSharedValue(0);

  const playerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: playerX.value + playerShakeX.value },
    ],
  }));

  const enemyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: enemyX.value + enemyShakeX.value },
    ],
  }));

  const playerHpStyle = useAnimatedStyle(() => ({
    width: `${playerHpWidth.value}%` as `${number}%`,
  }));

  const enemyHpStyle = useAnimatedStyle(() => ({
    width: `${enemyHpWidth.value}%` as `${number}%`,
  }));

  const processTurn = useCallback((idx: number) => {
    if (idx >= result.turns.length) {
      setShowResult(true);
      setTimeout(onComplete, 2000);
      return;
    }

    const turn = result.turns[idx];
    setCurrentTurnIdx(idx);

    if (turn.attacker === 'player') {
      // 攻撃者が前進: x+20→0 withSpring(パンチ感 damping:5, stiffness:600)
      playerX.value = withSequence(
        withSpring(20, { damping: 5, stiffness: 600 }),
        withSpring(0, { damping: 8, stiffness: 300 }),
      );
      // 敵がダメージシェイク: -10→10→-8→8→0
      enemyShakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 60 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(0, { duration: 60 }),
      );
      const newHp = turn.remainingHp;
      setEnemyHp(newHp);
      enemyHpWidth.value = withTiming(
        Math.max(0, (newHp / enemyStats.hp) * 100),
        { duration: 300 },
      );
      setDamageText({
        text: `${turn.damage}${turn.isCritical ? ' CRITICAL!' : ''}`,
        side: 'right',
      });
    } else {
      // 敵が前進: x-20→0 withSpring
      enemyX.value = withSequence(
        withSpring(-20, { damping: 5, stiffness: 600 }),
        withSpring(0, { damping: 8, stiffness: 300 }),
      );
      // プレイヤーがダメージシェイク
      playerShakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 60 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(0, { duration: 60 }),
      );
      const newHp = turn.remainingHp;
      setPlayerHp(newHp);
      playerHpWidth.value = withTiming(
        Math.max(0, (newHp / playerStats.hp) * 100),
        { duration: 300 },
      );
      setDamageText({
        text: `${turn.damage}${turn.isCritical ? ' CRITICAL!' : ''}`,
        side: 'left',
      });
    }

    setTimeout(() => {
      setDamageText(null);
      processTurn(idx + 1);
    }, 500);
  }, [result.turns, enemyStats.hp, playerStats.hp, onComplete, playerX, enemyX, playerHpWidth, enemyHpWidth, playerShakeX, enemyShakeX]);

  useEffect(() => {
    const timer = setTimeout(() => processTurn(0), 800);
    return () => clearTimeout(timer);
  }, [processTurn]);

  const getHpColor = (ratio: number) => {
    if (ratio > 0.5) return COLORS.hpBar.high;
    if (ratio > 0.2) return COLORS.hpBar.medium;
    return COLORS.hpBar.low;
  };

  return (
    <View style={styles.container}>
      {currentTurnIdx === -1 && (
        <View style={styles.battleStartRow}>
          <IconSvg name="battle" size={28} />
          <Text style={styles.battleStart}>BATTLE!</Text>
          <IconSvg name="battle" size={28} />
        </View>
      )}

      <View style={styles.fighters}>
        <Animated.View style={[styles.fighter, playerStyle]}>
          <View style={styles.fighterIconBox} accessibilityLabel={playerName}>
            <IconSvg name="dragon" size={48} />
          </View>
          <Text style={styles.fighterName}>{playerName}</Text>
          <View style={styles.hpBarBg}>
            <Animated.View
              style={[styles.hpBarFill, playerHpStyle, { backgroundColor: getHpColor(playerHp / playerStats.hp) }]}
            />
          </View>
          <Text style={styles.hpText}>HP:{playerHp}/{playerStats.hp}</Text>
        </Animated.View>

        <Text style={styles.vs}>VS</Text>

        <Animated.View style={[styles.fighter, enemyStyle]}>
          <View style={styles.fighterIconBox} accessibilityLabel={enemyName}>
            <IconSvg name="dragon" size={48} />
          </View>
          <Text style={styles.fighterName}>{enemyName}</Text>
          <View style={styles.hpBarBg}>
            <Animated.View
              style={[styles.hpBarFill, enemyHpStyle, { backgroundColor: getHpColor(enemyHp / enemyStats.hp) }]}
            />
          </View>
          <Text style={styles.hpText}>HP:{enemyHp}/{enemyStats.hp}</Text>
        </Animated.View>
      </View>

      {damageText && (
        <View style={[styles.damageContainer, damageText.side === 'left' ? styles.damageLeft : styles.damageRight]}>
          <Text style={[styles.damageText, damageText.text.includes('CRITICAL') && styles.criticalText]}>
            {damageText.text}
          </Text>
        </View>
      )}

      <View style={styles.turnLog}>
        <Text style={styles.turnLogTitle}>{'ターンログ'}</Text>
        {result.turns.slice(0, currentTurnIdx + 1).map((turn, i) => (
          <Text key={i} style={[styles.turnText, turn.isCritical && styles.criticalTurn]}>
            Turn{turn.turn}: {turn.attacker === 'player' ? playerName : enemyName}
            {' -> '}{turn.damage}dmg{turn.isCritical ? ' [CRITICAL]' : ''}
          </Text>
        ))}
      </View>

      {showResult && (
        <View style={styles.resultOverlay}>
          <View style={styles.resultContent}>
            <IconSvg
              name={result.winner === 'player' ? 'party' : result.winner === 'enemy' ? 'skull' : 'handshake'}
              size={48}
            />
            <Text style={styles.resultText}>
              {result.winner === 'player' ? 'YOU WIN!' :
               result.winner === 'enemy' ? 'YOU LOSE...' : 'DRAW'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  battleStartRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 },
  battleStart: { color: COLORS.text.primary, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  fighters: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 16 },
  fighter: { alignItems: 'center', width: 120 },
  fighterIconBox: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  fighterName: { color: COLORS.text.primary, fontSize: 12, fontWeight: '700', marginTop: 4 },
  vs: { color: COLORS.text.muted, fontSize: 20, fontWeight: '900' },
  hpBarBg: { width: 100, height: 10, backgroundColor: COLORS.bg.surface, borderRadius: 5, overflow: 'hidden', marginTop: 4 },
  hpBarFill: { height: '100%', borderRadius: 5 },
  hpText: { color: COLORS.text.secondary, fontSize: 10, marginTop: 2 },
  damageContainer: { position: 'absolute', top: '30%' },
  damageLeft: { left: 40 },
  damageRight: { right: 40 },
  damageText: { color: COLORS.ui.warning, fontSize: 18, fontWeight: '900' },
  criticalText: { color: COLORS.ui.error, fontSize: 22 },
  turnLog: { flex: 1, marginTop: 16, backgroundColor: COLORS.bg.surface, borderRadius: 12, padding: 12 },
  turnLogTitle: { color: COLORS.text.secondary, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  turnText: { color: COLORS.text.secondary, fontSize: 11, marginVertical: 1 },
  criticalTurn: { color: COLORS.ui.error, fontWeight: '700' },
  resultOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.bg.overlay, justifyContent: 'center', alignItems: 'center',
  },
  resultContent: { alignItems: 'center', gap: 12 },
  resultText: { color: COLORS.text.primary, fontSize: 32, fontWeight: '900' },
});
