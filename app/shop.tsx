import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { GAME_CONFIG } from '../src/constants/config';
import { generateGachaPart } from '../src/engine/drop';
import { getPartDef } from '../src/data/parts';
import { COLORS } from '../src/constants/colors';
import { ShopItem } from '../src/components/ShopItem';
import { IconSvg } from '../src/components/IconSvg';

export default function ShopScreen() {
  const router = useRouter();
  const store = useGameStore();

  const handleNormalGacha = () => {
    if (store.coins < GAME_CONFIG.GACHA_NORMAL_COST) {
      Alert.alert('\u30B3\u30A4\u30F3\u4E0D\u8DB3', '\u30B3\u30A4\u30F3\u304C\u8DB3\u308A\u307E\u305B\u3093');
      return;
    }
    if (store.inventory.length >= store.inventoryLimit) {
      Alert.alert('\u30A4\u30F3\u30D9\u30F3\u30C8\u30EA\u6E80\u676F', '\u5408\u6210\u304B\u58F2\u5374\u3067\u30B9\u30DA\u30FC\u30B9\u3092\u7A7A\u3051\u307E\u3057\u3087\u3046');
      return;
    }
    store.addCoins(-GAME_CONFIG.GACHA_NORMAL_COST);
    const part = generateGachaPart(false);
    store.addPart(part);
    const def = getPartDef(part.defId);
    Alert.alert(
      '\u30AC\u30C1\u30E3\u7D50\u679C',
      `${def?.name}\u3092\u5165\u624B\uFF01`
    );
    store.saveGame();
  };

  const handlePremiumGacha = () => {
    if (store.coins < GAME_CONFIG.GACHA_PREMIUM_COST) {
      Alert.alert('\u30B3\u30A4\u30F3\u4E0D\u8DB3', '\u30B3\u30A4\u30F3\u304C\u8DB3\u308A\u307E\u305B\u3093');
      return;
    }
    if (store.inventory.length >= store.inventoryLimit) {
      Alert.alert('\u30A4\u30F3\u30D9\u30F3\u30C8\u30EA\u6E80\u676F', '\u5408\u6210\u304B\u58F2\u5374\u3067\u30B9\u30DA\u30FC\u30B9\u3092\u7A7A\u3051\u307E\u3057\u3087\u3046');
      return;
    }
    store.addCoins(-GAME_CONFIG.GACHA_PREMIUM_COST);
    const part = generateGachaPart(true);
    store.addPart(part);
    const def = getPartDef(part.defId);
    Alert.alert(
      '\u30D7\u30EC\u30DF\u30A2\u30E0\u30AC\u30C1\u30E3\u7D50\u679C',
      `${def?.name}\u3092\u5165\u624B\uFF01`
    );
    store.saveGame();
  };

  const handleDailyReward = () => {
    const today = new Date().toISOString().split('T')[0];
    if (store.lastDailyRewardDate === today) {
      Alert.alert('\u53D7\u53D6\u6E08\u307F', '\u4ECA\u65E5\u306E\u30DC\u30FC\u30CA\u30B9\u306F\u53D7\u53D6\u6E08\u307F\u3067\u3059');
      return;
    }
    const part = store.claimDailyReward();
    const def = getPartDef(part.defId);
    Alert.alert(
      '\u30C7\u30A4\u30EA\u30FC\u30DC\u30FC\u30CA\u30B9',
      `${def?.name}\u3092\u5165\u624B\uFF01\n+${store.dailyStreak * 10}\u30B3\u30A4\u30F3`
    );
    store.saveGame();
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const dailyClaimed = store.lastDailyRewardDate === todayStr;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>{'\u2190 \u623B\u308B'}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <IconSvg name="shop" size={20} color={COLORS.text.primary} />
          <Text style={styles.headerTitle}>{'\u30B7\u30E7\u30C3\u30D7'}</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.coinsRow}>
        <IconSvg name="coin" size={18} />
        <Text style={styles.coins}>{store.coins} \u30B3\u30A4\u30F3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionTitle}>{'\u7121\u6599'}</Text>
        <ShopItem
          iconName="gift"
          title={'\u30C7\u30A4\u30EA\u30FC\u30DC\u30FC\u30CA\u30B9'}
          description={`\u30ED\u30B0\u30A4\u30F3\u30DC\u30FC\u30CA\u30B9\u3067\u90E8\u4F4D\u3092\u30B2\u30C3\u30C8\uFF01 (\u9023\u7D9A${store.dailyStreak}\u65E5)`}
          price={dailyClaimed ? '\u53D7\u53D6\u6E08\u307F' : '\u53D7\u3051\u53D6\u308B'}
          onBuy={handleDailyReward}
          disabled={dailyClaimed}
        />

        <Text style={styles.sectionTitle}>{'\u30B3\u30A4\u30F3\u3067\u8CFC\u5165'}</Text>
        <ShopItem
          iconName="dice"
          title={'\u30E9\u30F3\u30C0\u30E0\u90E8\u4F4D\u30AC\u30C1\u30E3'}
          description={'Common70% / Uncommon25% / Rare5%'}
          price={`${GAME_CONFIG.GACHA_NORMAL_COST}\u30B3\u30A4\u30F3`}
          onBuy={handleNormalGacha}
          disabled={store.coins < GAME_CONFIG.GACHA_NORMAL_COST}
        />
        <ShopItem
          iconName="gem"
          title={'\u30D7\u30EC\u30DF\u30A2\u30E0\u30AC\u30C1\u30E3'}
          description={'Uncommon40% / Rare35% / Epic20% / Legendary5%'}
          price={`${GAME_CONFIG.GACHA_PREMIUM_COST}\u30B3\u30A4\u30F3`}
          onBuy={handlePremiumGacha}
          disabled={store.coins < GAME_CONFIG.GACHA_PREMIUM_COST}
        />

        <Text style={styles.sectionTitle}>{'\u30D7\u30EC\u30DF\u30A2\u30E0 (\u6E96\u5099\u4E2D)'}</Text>
        <ShopItem
          iconName="forbidden"
          title={'\u5E83\u544A\u9664\u53BB\u30D1\u30C3\u30AF'}
          description={'\u30D0\u30CA\u30FC\u30FB\u30A4\u30F3\u30BF\u30FC\u30B9\u30C6\u524A\u9664'}
          price={'\uFFE5480'}
          onBuy={() => Alert.alert('IAP', '\u6E96\u5099\u4E2D\u3067\u3059')}
          disabled
        />
        <ShopItem
          iconName="box"
          title={'\u30B9\u30BF\u30FC\u30BF\u30FC\u30D1\u30C3\u30AF'}
          description={'Rare\u90E8\u4F4D3\u500B+1000\u30B3\u30A4\u30F3'}
          price={'\uFFE5980'}
          onBuy={() => Alert.alert('IAP', '\u6E96\u5099\u4E2D\u3067\u3059')}
          disabled
        />
      </ScrollView>
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
  coinsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 },
  coins: { color: COLORS.ui.warning, fontSize: 18, fontWeight: '700' },
  list: { padding: 16, gap: 10 },
  sectionTitle: { color: COLORS.text.secondary, fontSize: 14, fontWeight: '700', marginTop: 8 },
});
