import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        accessibilityLabel="特定商取引法に基づく表記"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="戻る"
        >
          <Text style={styles.backText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title} accessibilityRole="header">
          特定商取引法に基づく表記
        </Text>
        <View style={styles.table}>
          {[
            ['販売事業者', 'アプリ開発者'],
            ['所在地', '請求があれば開示します'],
            ['電話番号', '請求があれば開示します'],
            ['メールアドレス', 'support@example.com'],
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { flex: 1, padding: 16 },
  back: { marginBottom: 16, minHeight: 44, justifyContent: 'center' },
  backText: { color: '#2DD4BF', fontSize: 16 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  table: { gap: 12 },
  row: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 12,
  },
  label: { color: '#9CA3AF', fontSize: 12, marginBottom: 4 },
  value: { color: '#FFFFFF', fontSize: 14 },
});
