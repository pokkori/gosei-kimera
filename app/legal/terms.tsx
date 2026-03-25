import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        accessibilityLabel="利用規約"
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
          利用規約
        </Text>
        {[
          {
            heading: '第1条（適用）',
            body: '本規約は、本アプリの利用に関して、利用者と開発者との間の権利義務関係を定めるものです。',
          },
          {
            heading: '第2条（禁止事項）',
            body: '利用者は以下の行為を行ってはなりません。\n・不正な手段によるゲームデータの改ざん\n・本アプリのリバースエンジニアリング\n・他の利用者への迷惑行為\n・法令または公序良俗に違反する行為',
          },
          {
            heading: '第3条（免責事項）',
            body: '開発者は、本アプリの利用によって生じた損害について、一切の責任を負いません。また、本アプリのサービスは予告なく変更・終了する場合があります。',
          },
          {
            heading: '第4条（アプリ内課金）',
            body: 'アプリ内課金は購入完了後の返金・キャンセルができません。デジタルコンテンツの性質上、ご了承ください。',
          },
          {
            heading: '第5条（知的財産権）',
            body: '本アプリに関する著作権その他の知的財産権は開発者に帰属します。',
          },
          {
            heading: '第6条（準拠法・管轄裁判所）',
            body: '本規約は日本法に準拠します。本規約に関して紛争が生じた場合、開発者の所在地を管轄する裁判所を専属合意管轄とします。',
          },
        ].map(({ heading, body }) => (
          <View key={heading} style={styles.section}>
            <Text style={styles.sectionTitle}>{heading}</Text>
            <Text style={styles.body}>{body}</Text>
          </View>
        ))}
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
