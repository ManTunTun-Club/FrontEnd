import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';

export default function CartDraftScreen({ route }) {
  // 可能從 AiChatbotHome 帶來的資料
  const draft = route?.params?.draft ?? null;
  const items = draft?.items ?? [];
  const note = draft?.note ?? '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>草稿購物車</Text>
      </View>

      {note ? <Text style={styles.note}>備註：{note}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(it, idx) => `${it.name ?? it.text ?? 'item'}-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name ?? item.text ?? '未命名商品'}</Text>
            {!!item.spec && <Text style={styles.spec}>{item.spec}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>目前沒有項目</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E2E8F0' },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  note: { paddingHorizontal: 16, paddingVertical: 8, color: '#334155' },
  row: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10,
         shadowColor:'#000', shadowOpacity:0.05, shadowRadius:6, shadowOffset:{width:0,height:3}, elevation:3 },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  spec: { marginTop: 4, color: '#64748b' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 }
});
