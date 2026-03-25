import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { CodexGrid } from '../src/components/CodexGrid';
import { StatsBar } from '../src/components/StatsBar';
import { RarityBadge } from '../src/components/RarityBadge';
import { PartDef } from '../src/types';
import { COLORS } from '../src/constants/colors';

export default function CodexScreen() {
  const router = useRouter();
  const codexDiscovered = useGameStore(s => s.codexDiscovered);
  const [selectedDef, setSelectedDef] = useState<PartDef | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>{'\u2190 \u623B\u308B'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{'\u{1F4D6} \u90E8\u4F4D\u56F3\u9451'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <CodexGrid discovered={codexDiscovered} onSelectPart={setSelectedDef} />

      <Modal visible={!!selectedDef} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedDef && (
              <>
                <Text style={styles.emoji}>{selectedDef.emoji}</Text>
                <Text style={styles.name}>{selectedDef.name}</Text>
                <RarityBadge rarity={selectedDef.rarity} />
                <StatsBar stats={selectedDef.stats} />
                <Text style={styles.desc}>{selectedDef.description}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedDef(null)}>
                  <Text style={styles.closeText}>{'\u9589\u3058\u308B'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg.primary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { color: COLORS.ui.accentLight, fontSize: 16 },
  headerTitle: { color: COLORS.text.primary, fontSize: 18, fontWeight: '700' },
  modalOverlay: {
    flex: 1, backgroundColor: COLORS.bg.overlay,
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  modalCard: {
    backgroundColor: COLORS.bg.secondary, borderRadius: 20, padding: 24,
    width: '100%', alignItems: 'center', gap: 12,
  },
  emoji: { fontSize: 56 },
  name: { color: COLORS.text.primary, fontSize: 20, fontWeight: '700' },
  desc: { color: COLORS.text.secondary, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  closeBtn: { marginTop: 8 },
  closeText: { color: COLORS.text.muted, fontSize: 14, fontWeight: '600' },
});
