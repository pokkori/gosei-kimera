import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { getPartDef } from '../src/data/parts';
import { COLORS } from '../src/constants/colors';
import { ChimeraPreview } from '../src/components/ChimeraPreview';
import { PartSlot } from '../src/components/PartSlot';
import { MergeStation } from '../src/components/MergeStation';
import { PartInventory } from '../src/components/PartInventory';
import { StatsBar } from '../src/components/StatsBar';
import { RarityBadge } from '../src/components/RarityBadge';
import { PartInstance, SlotType, PartDef } from '../src/types';
import { generateUUID } from '../src/utils/uuid';

export default function MainScreen() {
  const router = useRouter();
  const store = useGameStore();
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [mergeSlot1, setMergeSlot1] = useState<PartInstance | null>(null);
  const [mergeSlot2, setMergeSlot2] = useState<PartInstance | null>(null);
  const [showEquipModal, setShowEquipModal] = useState<SlotType | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState(store.chimera.name);
  const [showDetailModal, setShowDetailModal] = useState<PartInstance | null>(null);

  // Initial parts for new players
  useEffect(() => {
    if (!store.tutorialCompleted && store.inventory.length === 0) {
      const starterParts: PartInstance[] = [
        { instanceId: generateUUID(), defId: 'head_dragon_0', acquiredAt: new Date().toISOString(), locked: false },
        { instanceId: generateUUID(), defId: 'body_phoenix_0', acquiredAt: new Date().toISOString(), locked: false },
        { instanceId: generateUUID(), defId: 'legs_kraken_0', acquiredAt: new Date().toISOString(), locked: false },
      ];
      starterParts.forEach(p => store.addPart(p));
      store.addCoins(100);

      // Mark tutorial as done (simplified)
      useGameStore.setState({ tutorialCompleted: true });
      store.saveGame();
    }
  }, []);

  const headDef = store.chimera.slots.head
    ? getPartDef(store.inventory.find(p => p.instanceId === store.chimera.slots.head)?.defId ?? '')
    : null;
  const bodyDef = store.chimera.slots.body
    ? getPartDef(store.inventory.find(p => p.instanceId === store.chimera.slots.body)?.defId ?? '')
    : null;
  const legsDef = store.chimera.slots.legs
    ? getPartDef(store.inventory.find(p => p.instanceId === store.chimera.slots.legs)?.defId ?? '')
    : null;

  const handleSelectPart = (instanceId: string) => {
    // If equip modal is showing, equip to that slot
    if (showEquipModal) {
      const part = store.inventory.find(p => p.instanceId === instanceId);
      if (!part) return;
      const def = getPartDef(part.defId);
      if (!def) return;

      const validTypes: Record<SlotType, string[]> = {
        head: ['head', 'wings'],
        body: ['body', 'arms'],
        legs: ['legs', 'tail'],
      };

      if (!validTypes[showEquipModal].includes(def.type)) {
        Alert.alert('\u88C5\u5099\u4E0D\u53EF', '\u3053\u306E\u30B9\u30ED\u30C3\u30C8\u306B\u306F\u88C5\u5099\u3067\u304D\u307E\u305B\u3093');
        return;
      }

      store.equipPart(showEquipModal, instanceId);
      setShowEquipModal(null);
      store.saveGame();
      return;
    }

    // Toggle selection for merge
    setSelectedParts(prev => {
      if (prev.includes(instanceId)) {
        // Deselect
        if (mergeSlot1?.instanceId === instanceId) setMergeSlot1(null);
        if (mergeSlot2?.instanceId === instanceId) setMergeSlot2(null);
        return prev.filter(id => id !== instanceId);
      }

      if (prev.length >= 2) return prev;

      const inst = store.inventory.find(p => p.instanceId === instanceId);
      if (inst) {
        if (!mergeSlot1) setMergeSlot1(inst);
        else if (!mergeSlot2) setMergeSlot2(inst);
      }

      return [...prev, instanceId];
    });
  };

  const handleMerge = (id1: string, id2: string) => {
    const result = store.mergeParts(id1, id2);
    if (result) {
      const def = getPartDef(result.defId);
      Alert.alert(
        '\u5408\u6210\u6210\u529F\uFF01',
        `${def?.emoji} ${def?.name} \u304C\u751F\u307E\u308C\u305F\uFF01`
      );
      store.saveGame();
    }
    setMergeSlot1(null);
    setMergeSlot2(null);
    setSelectedParts([]);
  };

  const handleClearMergeSlot = (slot: 1 | 2) => {
    if (slot === 1 && mergeSlot1) {
      setSelectedParts(prev => prev.filter(id => id !== mergeSlot1.instanceId));
      setMergeSlot1(null);
    } else if (slot === 2 && mergeSlot2) {
      setSelectedParts(prev => prev.filter(id => id !== mergeSlot2.instanceId));
      setMergeSlot2(null);
    }
  };

  const handleSlotPress = (slot: SlotType) => {
    setShowEquipModal(slot);
    setSelectedParts([]);
    setMergeSlot1(null);
    setMergeSlot2(null);
  };

  const handleSlotLongPress = (slot: SlotType) => {
    if (store.chimera.slots[slot]) {
      store.unequipPart(slot);
      store.saveGame();
    }
  };

  const handleRename = () => {
    store.renameChimera(newName);
    setShowRenameModal(false);
    store.saveGame();
  };

  const handleSellPart = (inst: PartInstance) => {
    const def = getPartDef(inst.defId);
    if (!def) return;
    const sellValue = { common: 10, uncommon: 25, rare: 60, epic: 150, legendary: 400 }[def.rarity];
    Alert.alert(
      '\u58F2\u5374\u78BA\u8A8D',
      `${def.name}\u3092${sellValue}\u30B3\u30A4\u30F3\u3067\u58F2\u5374\u3057\u307E\u3059\u304B\uFF1F`,
      [
        { text: '\u30AD\u30E3\u30F3\u30BB\u30EB', style: 'cancel' },
        {
          text: '\u58F2\u5374', style: 'destructive',
          onPress: () => {
            store.removePart(inst.instanceId);
            store.addCoins(sellValue);
            setShowDetailModal(null);
            store.saveGame();
          },
        },
      ]
    );
  };

  const detailDef = showDetailModal ? getPartDef(showDetailModal.defId) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerItem}>{'\u{1F4B0}'}{store.coins}</Text>
        <Text style={styles.headerItem}>{'\u2694\uFE0F'}Rank{store.arenaRank}</Text>
        <Text style={styles.headerItem}>{'\u{1F4CA}'}{store.record.wins}W</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        {/* Chimera Preview */}
        <TouchableOpacity style={styles.previewSection} onPress={() => setShowRenameModal(true)}>
          <ChimeraPreview headDef={headDef ?? null} bodyDef={bodyDef ?? null} legsDef={legsDef ?? null} size="medium" />
          <Text style={styles.chimeraName}>{store.chimera.name}</Text>
          <StatsBar stats={store.chimera.totalStats} compact />
          <Text style={styles.power}>{'\u26A1'}Power: {store.chimera.power}</Text>
        </TouchableOpacity>

        {/* Equipment Slots */}
        <View style={styles.slotsRow}>
          <PartSlot slot="head" partDef={headDef ?? null} onPress={() => handleSlotPress('head')} onLongPress={() => handleSlotLongPress('head')} highlighted={showEquipModal === 'head'} />
          <PartSlot slot="body" partDef={bodyDef ?? null} onPress={() => handleSlotPress('body')} onLongPress={() => handleSlotLongPress('body')} highlighted={showEquipModal === 'body'} />
          <PartSlot slot="legs" partDef={legsDef ?? null} onPress={() => handleSlotPress('legs')} onLongPress={() => handleSlotLongPress('legs')} highlighted={showEquipModal === 'legs'} />
        </View>

        {showEquipModal && (
          <View style={styles.equipHint}>
            <Text style={styles.equipHintText}>
              {'\u{1F447}'} {'\u88C5\u5099\u3059\u308B\u90E8\u4F4D\u3092\u30BF\u30C3\u30D7\u3057\u3066\u304F\u3060\u3055\u3044'}
            </Text>
            <TouchableOpacity onPress={() => setShowEquipModal(null)}>
              <Text style={styles.cancelText}>{'\u30AD\u30E3\u30F3\u30BB\u30EB'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Merge Station */}
        {!showEquipModal && (
          <MergeStation
            slot1={mergeSlot1}
            slot2={mergeSlot2}
            onMerge={handleMerge}
            onClearSlot={handleClearMergeSlot}
          />
        )}
      </ScrollView>

      {/* Inventory */}
      <View style={styles.inventorySection}>
        <PartInventory
          inventory={store.inventory}
          selectedIds={selectedParts}
          onSelectPart={handleSelectPart}
          inventoryLimit={store.inventoryLimit}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/arena')} accessibilityRole="button" accessibilityLabel="闘技場へ移動">
          <Text style={styles.navIcon}>{'\u2694\uFE0F'}</Text>
          <Text style={styles.navLabel}>{'\u95D8\u6280\u5834'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/codex')} accessibilityRole="button" accessibilityLabel="図鑑へ移動">
          <Text style={styles.navIcon}>{'\u{1F4D6}'}</Text>
          <Text style={styles.navLabel}>{'\u56F3\u9451'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/shop')} accessibilityRole="button" accessibilityLabel="ショップへ移動">
          <Text style={styles.navIcon}>{'\u{1F6D2}'}</Text>
          <Text style={styles.navLabel}>{'\u30B7\u30E7\u30C3\u30D7'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/legal')} accessibilityRole="button" accessibilityLabel="特定商取引法に基づく表記">
          <Text style={styles.navIcon}>{'\u2139\uFE0F'}</Text>
          <Text style={styles.navLabel}>{'\u6CD5\u7684\u60C5\u5831'}</Text>
        </TouchableOpacity>
      </View>

      {/* Rename Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{'\u30AD\u30E1\u30E9\u306E\u540D\u524D'}</Text>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              maxLength={10}
              placeholderTextColor={COLORS.text.muted}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowRenameModal(false)}>
                <Text style={styles.cancelText}>{'\u30AD\u30E3\u30F3\u30BB\u30EB'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleRename}>
                <Text style={styles.confirmButtonText}>{'\u6C7A\u5B9A'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Part Detail Modal */}
      <Modal visible={!!showDetailModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {detailDef && showDetailModal && (
              <>
                <Text style={styles.detailEmoji}>{detailDef.emoji}</Text>
                <Text style={styles.detailName}>{detailDef.name}</Text>
                <RarityBadge rarity={detailDef.rarity} />
                <StatsBar stats={detailDef.stats} />
                <Text style={styles.detailDesc}>{detailDef.description}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => handleSellPart(showDetailModal)}>
                    <Text style={[styles.cancelText, { color: COLORS.ui.error }]}>{'\u58F2\u5374'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowDetailModal(null)}>
                    <Text style={styles.cancelText}>{'\u9589\u3058\u308B'}</Text>
                  </TouchableOpacity>
                </View>
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
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8,
    backgroundColor: COLORS.bg.secondary, borderBottomWidth: 1, borderBottomColor: COLORS.ui.border,
  },
  headerItem: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700' },
  scrollContent: { flex: 1 },
  scrollInner: { padding: 16, gap: 12, alignItems: 'center' },
  previewSection: { alignItems: 'center', marginBottom: 4 },
  chimeraName: { color: COLORS.text.primary, fontSize: 18, fontWeight: '700', marginTop: 4 },
  power: { color: COLORS.ui.warning, fontSize: 14, fontWeight: '700', marginTop: 4 },
  slotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  equipHint: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, backgroundColor: COLORS.bg.surface, borderRadius: 8 },
  equipHintText: { color: COLORS.ui.accentLight, fontSize: 12, flex: 1 },
  cancelText: { color: COLORS.text.muted, fontSize: 14, fontWeight: '600' },
  inventorySection: { borderTopWidth: 1, borderTopColor: COLORS.ui.border, paddingVertical: 8 },
  nav: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8,
    backgroundColor: COLORS.bg.secondary, borderTopWidth: 1, borderTopColor: COLORS.ui.border,
  },
  navButton: { alignItems: 'center', paddingHorizontal: 20 },
  navIcon: { fontSize: 24 },
  navLabel: { color: COLORS.text.secondary, fontSize: 10, marginTop: 2 },
  modalOverlay: {
    flex: 1, backgroundColor: COLORS.bg.overlay,
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  modalCard: {
    backgroundColor: COLORS.bg.secondary, borderRadius: 20, padding: 24,
    width: '100%', alignItems: 'center', gap: 12,
  },
  modalTitle: { color: COLORS.text.primary, fontSize: 18, fontWeight: '700' },
  nameInput: {
    backgroundColor: COLORS.bg.surface, color: COLORS.text.primary,
    borderRadius: 8, padding: 12, width: '100%', fontSize: 16, textAlign: 'center',
  },
  modalButtons: { flexDirection: 'row', gap: 24, marginTop: 8 },
  confirmButton: {
    backgroundColor: COLORS.ui.accent, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8,
  },
  confirmButtonText: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700' },
  detailEmoji: { fontSize: 48 },
  detailName: { color: COLORS.text.primary, fontSize: 18, fontWeight: '700' },
  detailDesc: { color: COLORS.text.secondary, fontSize: 12, textAlign: 'center' },
});
