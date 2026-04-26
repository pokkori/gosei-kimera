import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LegalScreen() {
  const router = useRouter();
  return (
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        accessibilityLabel="特定商取引法に基づく表記"
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="戻る"
        >
          <Text style={styles.backText}>← 戻る</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          特定商取引法に基づく表記
        </Text>
        <View style={styles.table}>
          {[
            ['販売事業者', 'アプリ開発者'],
            ['所在地', '請求があれば開示します'],
            ['電話番号', '090-6093-5290'],
            ['メールアドレス', 'support@chimera-forge.app'],
            ['価格', 'アプリ内課金あり（表示価格通り）'],
            ['支払時期', 'ご購入時'],
            ['支払方法', 'App Store / Google Play 決済'],
            ['役務提供時期', '購入完了後即時'],
            ['返品・キャンセル', 'デジタルコンテンツの性質上、返品不可'],
            ['動作環境', 'iOS 16.0以上 / Android 8.0以上'],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, padding: 16 },
  back: { marginBottom: 16, minHeight: 44, justifyContent: 'center' },
  backText: { color: '#2DD4BF', fontSize: 16 },
  title: { color: '#F1F5F9', fontSize: 20, fontWeight: 'bold', marginBottom: 24, textShadowColor: '#7C4DFF', textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 } },
  table: { gap: 12 },
  row: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: { color: '#9CA3AF', fontSize: 12, marginBottom: 4 },
  value: { color: '#FFFFFF', fontSize: 14 },
});
