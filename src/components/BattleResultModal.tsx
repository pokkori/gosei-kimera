import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
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

export const BattleResultModal: React.FC<Props> = ({ visible, result, onClose }) => {
  const rewardDef = result.rewardPart ? getPartDef(result.rewardPart.defId) : null;

  const resultIcon =
    result.winner === 'player' ? 'party' :
    result.winner === 'enemy' ? 'skull' : 'handshake';

  const resultLabel =
    result.winner === 'player' ? 'YOU WIN!' :
    result.winner === 'enemy' ? 'YOU LOSE...' : 'DRAW';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <IconSvg name={resultIcon} size={32} />
            <Text style={styles.title}>{resultLabel}</Text>
            <IconSvg name={resultIcon} size={32} />
          </View>

          {result.winner === 'player' && (
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
        </View>
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
  title: { color: COLORS.text.primary, fontSize: 24, fontWeight: '900' },
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
