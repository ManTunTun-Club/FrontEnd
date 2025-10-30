import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ActionTile from '../components/ActionTile';
import StatCard from '../components/StatCard';

export default function ProfileScreen() {
  // 後台資料
  const walletTotal = 2000;
  const mallTotal = 2000;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}/>
        <Text style={styles.title}>名稱</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 點選區塊 */}
        <View style={styles.row}>
          <ActionTile label="提醒" />
          <ActionTile label="訂閱" />
          <ActionTile label="訂單" />
        </View>

        {/* 錢包 */}
        <Text style={styles.sectionTitle}>錢包</Text>
        <StatCard title="錢包" amount={walletTotal} />

        {/* 商城 */}
        <Text style={[styles.sectionTitle, {marginTop: 18}]}>商城</Text>
        <StatCard title="商城" amount={mallTotal}/>

        {/* 設定清單 */}
        <View style={styles.settingCard}>
          <Text style={styles.settingLeft}>修改密碼</Text>
          <Text style={styles.settingRight}>›</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F6F8FA'},
  container: {padding: 16, paddingBottom: 40},
  header: {
    padding: 16, height: 72, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#E6EBF3',
  },
  avatar: {width: 36, height: 36, borderRadius: 18, backgroundColor: '#111', marginRight: 10},
  title: {fontSize: 20, fontWeight: '700', color: '#2A2F3A'},
  row: {flexDirection: 'row', marginTop: 12},
  sectionTitle: {marginTop: 16, marginBottom: 6, color: '#2A2F3A', fontSize: 16, fontWeight: '700'},
  settingCard: {
    backgroundColor: 'white', borderRadius: 14, height: 120, marginTop: 18, padding: 16,
    borderWidth: 1, borderColor: '#E6EBF3', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  settingLeft: {fontSize: 16, color: '#2A2F3A', fontWeight: '600'},
  settingRight: {fontSize: 28, color: '#7F8CA3', marginTop: -6},
});
