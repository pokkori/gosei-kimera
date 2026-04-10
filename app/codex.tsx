import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={() => router.back()}
          accessibilityLabel="戻る"
          accessibilityRole="button"
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text style={styles.backBtn}>{'\u2190 \u623B\u308B'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{'\u90E8\u4F4D\u56F3\u9451'}</Text>
        <View style={{ width: 60 }} />
      </Animated.View>

      <CodexGrid discovered={codexDiscovered} onSelectPart={setSelectedDef} />

      <Modal visible={!!selectedDef} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedDef && (
              <>
                <Text style={styles.name}>{selectedDef.name}</Text>
                <RarityBadge rarity={selectedDef.rarity} />
                <StatsBar stats={selectedDef.stats} />
                <Text style={styles.desc}>{selectedDef.description}</Text>
                <Pressable style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]} onPress={() => setSelectedDef(null)}
                  accessibilityLabel="閉じる" accessibilityRole="button">
                  <Text style={styles.closeText}>{'\u9589\u3058\u308B'}</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  modalCard: {
    backgroundColor: 'rgba(26,10,46,0.95)', borderRadius: 20, padding: 24,
    width: '100%', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  name: { color: '#F1F5F9', fontSize: 20, fontWeight: '700', textShadowColor: '#7C4DFF', textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 } },
  desc: { color: '#B0B0CC', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  closeBtn: { marginTop: 8, minHeight: 44, justifyContent: 'center', paddingHorizontal: 16 },
  closeText: { color: COLORS.text.muted, fontSize: 14, fontWeight: '600' },
});
