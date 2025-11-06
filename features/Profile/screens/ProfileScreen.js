import React from 'react';
import { SafeAreaView, useSafeAreaInsets  } from 'react-native-safe-area-context';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import ActionTile from '../components/ActionTile';
import StatCard from '../components/StatCard';
import SettingItem from '../components/SettingItem-Button';
import ProfileHeader from '../components/ProfileHeader';

import notifyIcon from '../../../assets/icons/notify.png';
import couponIcon from '../../../assets/icons/coupon.png';
import orderHistoryIcon from '../../../assets/icons/order-history.png';

import { useNavigation } from '@react-navigation/native';


export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top','left','right']}>
      {/* Header */}
      <ProfileHeader
        name="名稱"
        // avatarSource={{ uri: '' }}  
        onPressAvatar={() => navigation.navigate('WalletScreen')}
        onPressName={() => navigation.navigate('WalletScreen')}
      />

      <ScrollView contentContainerStyle={[
        styles.container,
        { paddingBottom: Math.max(8, insets.bottom) }
        ]}
      >
        {/* 點選區塊 */}
        <View style={styles.row}>
          <ActionTile
            label="提醒"
            icon={notifyIcon}
            onPress={() => navigation.navigate('WalletScreen')}
          />
          <ActionTile
            label="訂閱"
            icon={couponIcon}
            onPress={() => navigation.navigate('WalletScreen')}
          />
          <ActionTile
            label="訂單"
            icon={orderHistoryIcon}
            onPress={() => navigation.navigate('WalletScreen')}
          />
        </View>



        {/* 折扣總計 */}
        <StatCard
          monthLabel="8月"
          totalSaved={3090}
          cashDiscount={2400}
          pointsRebate={690}
          onPressMonth={() => {
            navigation.navigate('WalletScreen');
          }}
        />

        {/* 設定清單 */}
        <View style={styles.settingCard}>
          <SettingItem
            label="修改密碼"
            onPress={() => navigation.navigate('WalletScreen')}
          />
          <SettingItem
            label="支付設定"
            onPress={() => navigation.navigate('WalletScreen')}
            showDivider={false}
          />
          <SettingItem
            label=" 平台設定"
            onPress={() => navigation.navigate('WalletScreen')}
            showDivider={false}
          />
          <SettingItem
            label="意見回饋"
            onPress={() => navigation.navigate('WalletScreen')}
            showDivider={false}
          />
          <SettingItem
            label="登出"
            onPress={() => navigation.navigate('WalletScreen')}
            showDivider={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FA' },
  container: { padding: 16},
  header: {
    padding: 16,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6EBF3',
    backgroundColor: '#fff',
  },
  avatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#111', 
    marginRight: 10 
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#2A2F3A' 
  },

  row: { 
    flexDirection: 'row', 
    marginTop: 12, 
    gap: 12, 
    justifyContent: 'space-between' 
  },

  sectionTitle: { 
    marginTop: 16, 
    marginBottom: 6, 
    color: '#2A2F3A', 
    fontSize: 16, 
    fontWeight: '700' 
  },

  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#E6EBF3',
    overflow: 'hidden',
  },
});