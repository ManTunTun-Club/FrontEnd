import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../../App';
import { COLORS } from '../../../theme/theme-color';

import SetPayment from '../components/SetPayment';

//假設loder
const mockLoadCardTypes = async (bank) => {
  // TODO: 改成呼叫你的後端
  await new Promise(r => setTimeout(r, 600));
  const map = {
    玉山銀行: ['U Bear 卡', 'Pi 拍錢包卡', 'Only 卡'],
    台新銀行: ['FlyGo', 'Black 卡', '太陽神卡'],
    永豐銀行: ['大戶卡', 'Sport 卡'],
    國泰世華: ['CUBE', 'KOKO Combo'],
    富邦銀行: ['J 卡', 'momo 卡'],
  };
  return map[bank] || [];
};



export default function SignupPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { signIn } = useAuth();

  const { account, password } = route.params || {};

  // 已選支付清單
  const [methods, setMethods] = useState([]);

  // 控制小視窗顯示
  const [showSetPayment, setShowSetPayment] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const addMethod = () => setShowSetPayment(true);

  // 小視窗「確認新增」，結果傳回到列表
  const handleSubmitPayment = (payload) => {
    const id = `${payload.method}-${Date.now()}`;
    const label =
      payload.method === 'card'
        ? `${payload.cardCompany} / ${payload.cardType}`
        : payload.thirdProvider;

    setMethods((prev) => [
      ...prev, 
      { 
        id, 
        type: payload.method,            // 'card' | 'third'
        bank: payload.cardCompany || '',
        cardType: payload.cardType || '',
        provider: payload.thirdProvider || '',
        icon: null }]);
  };

  const onFinish = () => {
    // API：帳號建立 + 綁定支付方式
    signIn();
  };

  return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back} hitSlop={{top:10,left:10,right:10,bottom:10}}>
          <Image source={require('../../../assets/icons/arrow-right-2.png')} style={s.backIcon} />
        </TouchableOpacity>

        <View style={s.titleWrap}>
          <Text style={s.title}>選擇支付管道</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={s.container}>
        {methods.map(m => {
          const label = m.type === 'card' ? `${m.bank} / ${m.cardType}` : m.provider;
          return (
            <TouchableOpacity key={m.id} onPress={() => handleEdit(m)} activeOpacity={0.8}>
              <View style={s.methodCard}>
                <View style={s.iconBox}>
                  <Image source={require('../../../assets/icons/LOGO.png')} style={{width:24,height:24}} />
                </View>
                <Text style={s.methodText}>{label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* 按鈕 → 小視窗 */}
        <View style={s.addBtnWrap}>
          <TouchableOpacity onPress={addMethod} style={s.addBtn} activeOpacity={0.8}>
            <Text style={s.addBtnText}>＋</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={s.doneBtn} onPress={onFinish} activeOpacity={0.9}>
          <Text style={s.doneText}>完成</Text>
        </TouchableOpacity>
      </View>

      {/* 小視窗；按確認才會回傳資料 */}
      <SetPayment
        visible={showSetPayment}
        onClose={() => setShowSetPayment(false)}
        onSubmit={handleSubmitPayment}
        loadCardTypes={mockLoadCardTypes}
      />
    </SafeAreaView>
  );
}



const bg = COLORS.primary;
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingHorizontal: 16, 
    marginBottom: 8,
  },
  back: {
    width: 44,              
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 12,
    height: 12,
    transform: [{ rotate: '180deg' }], 
    tintColor: '#111',
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: bg },

  container: { paddingHorizontal: 24, paddingTop: 8, flex: 1 },

  methodCard: {
    borderWidth: 2, borderColor: '#d7d5d5ff', borderRadius: 12,
    padding: 12, flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 12, backgroundColor: '#FFF',
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: '#E9EDF5',
    alignItems: 'center', justifyContent: 'center',
  },
  methodText: { fontSize: 16, color: '#111827' },

  addBtn: {
    marginTop: 8, width: 36, height: 36, borderRadius: 18, backgroundColor: '#6B8CFF',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700', lineHeight: 22 },

  doneBtn: {
    height: 48, borderRadius: 12, backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  doneText: { color: '#FFF', fontWeight: '700' },
  addBtnWrap: {
  alignItems: 'center',   
  marginTop: 8,
  marginBottom: 16,
},
});
