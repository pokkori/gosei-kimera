import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrivacyScreen() {
  const router = useRouter();
  return (
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        accessibilityLabel="プライバシーポリシー"
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
          <Text style={styles.body}>support@chimera-forge.app</Text>
        </View>
        <Text style={styles.date}>最終更新: 2026年1月</Text>
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
  section: { marginBottom: 20 },
  sectionTitle: { color: '#2DD4BF', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  body: { color: '#D1D5DB', fontSize: 14, lineHeight: 22 },
  date: { color: '#6B7280', fontSize: 12, marginTop: 8, marginBottom: 32 },
});
