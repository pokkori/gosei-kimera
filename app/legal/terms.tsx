import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsScreen() {
  const router = useRouter();
  return (
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        accessibilityLabel="利用規約"
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
          {
            heading: '第7条（仮想通貨の有効期限）',
            body: '本アプリ内で取得したコイン・ジェム等の仮想通貨は、取得日から180日間有効です。有効期限を過ぎた仮想通貨は自動的に失効し、返金はいたしません。',
          },
          {
            heading: '第8条（未成年者の利用）',
            body: '未成年者が本アプリを利用する場合は、保護者の同意を得た上でご利用ください。未成年者による課金は、保護者の同意があるものとみなします。15歳以下の月額課金上限は5,000円、16〜17歳は10,000円を推奨します。',
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
