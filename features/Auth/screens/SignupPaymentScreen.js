//SignupPaymentScreen
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../../App';
import { COLORS } from '../../../theme/theme-color';

const paymentIcons = {
  玉山銀行: require('../../../assets/payments/esun.png'),
  台新銀行: require('../../../assets/payments/taishin.png'),
  永豐銀行: require('../../../assets/payments/sinopac.png'),
  國泰世華: require('../../../assets/payments/cathay.png'),
  富邦銀行: require('../../../assets/payments/fubon.png'),
  ApplePay: require('../../../assets/payments/applepay.png'),
  LINEPay: require('../../../assets/payments/linepay.png'),
  JKoPay: require('../../../assets/payments/jkpay.png'),
  街口支付: require('../../../assets/payments/jkpay.png'),
  悠遊付: require('../../../assets/payments/easywallet.png'),
};

import SetPayment from '../components/SetPayment';

//假設loder
const mockLoadCardTypes = async (bank) => {
  // TODO: 改成呼叫你的後端
  await new Promise(r => setTimeout(r, 600));
  const map = {
    玉山銀行: ['U Bear 卡', 'Pi 拍錢包卡', 'Only 卡'],
    台新銀行: ['FlyGo', 'Black 卡', '太陽神卡'],
    永豐銀行: ['DAWAY 卡', 'Sport 卡'],
    國泰世華: ['CUBE', 'KOKO Combo'],
    富邦銀行: ['J 卡', 'momo 卡', 'Costco聯名卡'],
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

  const addMethod = () => {           
    setEditingItem(null);
    setShowSetPayment(true);
  };

  // 點既有卡片/支付 → 進入編輯模式
  const handleEdit = (item) => {
   setEditingItem(item);
   setShowSetPayment(true);
  };

  // 小視窗「確認新增」，結果傳回到列表
  const handleSubmitPayment = (payload) => {
    if (payload.method === 'card' && Array.isArray(payload.cardTypes)) {
      const now = Date.now();
      setMethods((prev) => {
        let base = editingItem ? prev.filter(p => p.id !== editingItem.id) : [...prev];
        const existed = new Set(base.filter(p => p.type==='card').map(p => `${p.bank}-${p.cardType}`));
        const newItems = payload.cardTypes
          .filter(ct => !existed.has(`${payload.cardCompany}-${ct}`))
          .map((ct, i) => ({
            id: `card-${now}-${i}`,
            type: 'card',
            bank: payload.cardCompany,
            cardType: ct,
            provider: '',
            icon: null,
          }));
        return [...base, ...newItems];
      });
    } else {
      // 第三方支付
      const item = {
        id: editingItem ? editingItem.id : `third-${Date.now()}`,
        type: 'third',
        bank: '',
        cardType: '',
        provider: payload.thirdProvider || '',
        icon: null,
      };
      setMethods((prev) => {
        if (!editingItem) {
          if (prev.some(p => p.type==='third' && p.provider===item.provider)) return prev;
          return [...prev, item];
        }
        return prev.map(p => (p.id === editingItem.id ? item : p));
      });
    }
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
      {/* 信用卡區塊 */}
      {methods.some(m => m.type === 'card') && (
        <>
          <Text style={s.sectionTitle}>信用卡</Text>
          {methods
            .filter(m => m.type === 'card')
            .map(m => (
              <TouchableOpacity key={m.id} onPress={() => handleEdit(m)} activeOpacity={0.8}>
                <View style={s.methodCard}>
                  <View style={s.iconBox}>
                    <Image
                      source={paymentIcons[m.bank] || paymentIcons[m.provider] || require('../../../assets/icons/LOGO.png')}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={s.methodText}>{`${m.bank} / ${m.cardType}`}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </>
      )}

      {/* 第三方支付區塊 */}
      {methods.some(m => m.type === 'third') && (
        <>
          <Text style={[s.sectionTitle, { marginTop: 16 }]}>第三方支付</Text>
          {methods
            .filter(m => m.type === 'third')
            .map(m => (
              <TouchableOpacity key={m.id} onPress={() => handleEdit(m)} activeOpacity={0.8}>
                <View style={s.methodCard}>
                  <View style={s.iconBox}>
                    <Image
                      source={paymentIcons[m.bank] || paymentIcons[m.provider] || require('../../../assets/icons/LOGO.png')}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={s.methodText}>{m.provider}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </>
      )}


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
        existingCards={methods.filter(m => m.type === 'card' && (!editingItem || m.id !== editingItem.id))}
        initialMethod={editingItem?.type ?? null}
        initialCompany={editingItem?.bank ?? ''}
        initialSelectedTypes={editingItem?.cardType ? [editingItem.cardType] : []}
        initialThirdProvider={editingItem?.provider ?? ''}
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
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F7F9FC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B8CFF',
    marginBottom: 8,
    marginTop: 12,
  },
});
