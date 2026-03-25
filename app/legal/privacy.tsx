import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        accessibilityLabel="プライバシーポリシー"
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
          プライバシーポリシー
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 個人情報の収集について</Text>
          <Text style={styles.body}>
            本アプリはローカルデバイス上にゲームデータを保存します。
            個人情報の収集・外部サーバーへの送信は行いません。
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. データの利用目的</Text>
          <Text style={styles.body}>
            保存されるデータはゲームプレイの継続・設定の保持のみに利用されます。
            マーケティング・第三者への提供には使用しません。
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. 広告について</Text>
          <Text style={styles.body}>
            本アプリはAdMob（Google）による広告を表示する場合があります。
            広告配信にはデバイス識別情報が使用されることがあります。
            詳細はGoogleのプライバシーポリシーをご確認ください。
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. お問い合わせ</Text>
          <Text style={styles.body}>support@example.com</Text>
        </View>
        <Text style={styles.date}>最終更新: 2026年1月</Text>
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
  section: { marginBottom: 20 },
  sectionTitle: { color: '#2DD4BF', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  body: { color: '#D1D5DB', fontSize: 14, lineHeight: 22 },
  date: { color: '#6B7280', fontSize: 12, marginTop: 8, marginBottom: 32 },
});
