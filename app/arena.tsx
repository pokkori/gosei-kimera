import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGameStore } from '../src/store/gameStore';
import { ENEMY_DATA } from '../src/data/enemies';
import { EnemyDef, BattleResult } from '../src/types';
import { COLORS } from '../src/constants/colors';
import { BattleAnimation } from '../src/components/BattleAnimation';
import { BattleResultModal } from '../src/components/BattleResultModal';
import { getPartDef } from '../src/data/parts';
import { IconSvg } from '../src/components/IconSvg';

type Phase = 'select' | 'battle' | 'result';

export default function ArenaScreen() {
  const router = useRouter();
  const store = useGameStore();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedEnemy, setSelectedEnemy] = useState<EnemyDef | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  const enemies = useMemo(() => {
    return ENEMY_DATA.filter(e => e.arenaRank === store.arenaRank)
      .slice(0, 3);
  }, [store.arenaRank]);

  // If not enough enemies for exact rank, show nearby
  const displayEnemies = enemies.length > 0 ? enemies :
    ENEMY_DATA.filter(e => Math.abs(e.arenaRank - store.arenaRank) <= 1).slice(0, 3);

  const handleChallenge = (enemy: EnemyDef) => {
    if (store.chimera.power <= 0) {
      return;
    }
    setSelectedEnemy(enemy);
    const result = store.executeBattle(enemy);
    setBattleResult(result);
    setPhase('battle');
  };

  const handleBattleComplete = () => {
    setPhase('result');
    // Check rank up
    if (battleResult?.winner === 'player') {
      const allEnemiesAtRank = ENEMY_DATA.filter(e => e.arenaRank === store.arenaRank);
      // Simplified rank up: win 3 times at current rank
      if (store.record.wins > 0 && store.record.wins % 3 === 0 && store.arenaRank < 10) {
        useGameStore.setState(s => ({ arenaRank: Math.min(10, s.arenaRank + 1) }));
      }
    }
    store.saveGame();
  };

  const handleCloseResult = () => {
    setPhase('select');
    setSelectedEnemy(null);
    setBattleResult(null);
  };

  if (phase === 'battle' && selectedEnemy && battleResult) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <BattleAnimation
          playerName={store.chimera.name}
          playerEmoji=""
          playerStats={store.chimera.totalStats}
          enemyName={selectedEnemy.name}
          enemyEmoji=""
          enemyStats={selectedEnemy.totalStats}
          result={battleResult}
          onComplete={handleBattleComplete}
        />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={() => router.back()}
          accessibilityLabel="戻る"
          accessibilityRole="button"
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text style={styles.backBtn}>{'\u2190 \u623B\u308B'}</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <IconSvg name="battle" size={20} />
          <Text style={styles.headerTitle}>{'\u95D8\u6280\u5834'}</Text>
        </View>
        <View style={{ width: 60 }} />
      </Animated.View>

      {store.chimera.power <= 0 && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            {'\u90E8\u4F4D\u3092\u88C5\u5099\u3057\u3066\u304B\u3089\u6311\u6226\u3057\u3088\u3046\uFF01'}
          </Text>
        </View>
      )}

      <Text style={styles.rankText}>Rank {store.arenaRank}</Text>

      <FlatList
        data={displayEnemies}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const power = item.totalStats.atk + item.totalStats.hp + item.totalStats.spd;
          return (
            <View style={styles.enemyCard}>
              <View style={styles.enemyIconBox}>
                <IconSvg name="dragon" size={36} />
              </View>
              <View style={styles.enemyInfo}>
                <Text style={styles.enemyName}>{item.name}</Text>
                <Text style={styles.enemyStats}>
                  ATK:{item.totalStats.atk} HP:{item.totalStats.hp} SPD:{item.totalStats.spd}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <IconSvg name="fire" size={14} />
                  <Text style={styles.enemyPower}>Power: {power}</Text>
                </View>
              </View>
              <Pressable
                style={[styles.challengeBtn, store.chimera.power <= 0 && styles.challengeBtnDisabled]}
                onPress={() => handleChallenge(item)}
                disabled={store.chimera.power <= 0}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <IconSvg name="sword" size={16} />
                  <Text style={styles.challengeText}>{'\u6311\u6226'}</Text>
                </View>
              </Pressable>
            </View>
          );
        }}
      />

      {/* Result Modal */}
      {battleResult && (
        <BattleResultModal
          visible={phase === 'result'}
          result={battleResult}
          onClose={handleCloseResult}
        />
      )}
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { color: COLORS.ui.accentLight, fontSize: 16 },
  headerTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '700', textShadowColor: '#7C4DFF', textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 } },
  warningBox: {
    backgroundColor: COLORS.ui.error + '33', margin: 16, padding: 12, borderRadius: 8,
  },
  warningText: { color: COLORS.ui.error, fontSize: 13, textAlign: 'center' },
  rankText: { color: COLORS.ui.warning, fontSize: 16, fontWeight: '700', textAlign: 'center', marginVertical: 8 },
  list: { padding: 16, gap: 12 },
  enemyCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, padding: 12, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  enemyIconBox: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  enemyInfo: { flex: 1 },
  enemyName: { color: COLORS.text.primary, fontSize: 16, fontWeight: '700' },
  enemyStats: { color: COLORS.text.secondary, fontSize: 11, marginTop: 2 },
  enemyPower: { color: COLORS.ui.warning, fontSize: 12, fontWeight: '700', marginTop: 2 },
  challengeBtn: {
    backgroundColor: COLORS.ui.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    shadowColor: '#7C4DFF', shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4, minHeight: 44, justifyContent: 'center',
  },
  challengeBtnDisabled: { opacity: 0.4 },
  challengeText: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700' },
});
