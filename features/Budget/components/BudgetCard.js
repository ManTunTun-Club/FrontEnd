import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function BudgetCard({
  title,
  amount = 0,
  percent = 0,      
  color = '#60A5FA',   
  onPressEdit,
  onPressList,
}) {
  return (
    <View style={[styles.card, { backgroundColor: '#F8FAFC' }]}>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.amount}>{`$${amount.toLocaleString()}`}</Text>
          <Text style={styles.percent}>{`${percent}%`}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.actions}>
          <Pressable onPress={onPressList} style={styles.actionBtn}>
            <Text style={styles.actionText}>🧾</Text>
          </Pressable>
          <Pressable onPress={onPressEdit} style={styles.actionBtn}>
            <Text style={styles.actionText}>✎</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  colorBar: {
    width: 10,
    borderRadius: 10,
  },
  body: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  amount: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  percent: { fontSize: 16, color: '#334155' },
  title: { marginTop: 6, color: '#64748B' },
  actions: { marginTop: 10, flexDirection: 'row', gap: 10 },
  actionBtn: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionText: { fontSize: 16 },
});
