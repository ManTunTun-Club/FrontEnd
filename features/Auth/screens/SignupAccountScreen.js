//SignupAccountScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../theme/theme-color';

export default function SignupAccountScreen() {
  const navigation = useNavigation();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const onNext = () => {
    // TODO: 基本驗證
    navigation.navigate('SignupPayment', { account, password });
  };

  const continueWithGoogle = () => {
    // TODO: 串 Google 
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Image
            source={require('../../../assets/icons/arrow-right-2.png')}
            style={s.backIcon}
          />
        </TouchableOpacity>

        <View style={s.titleWrap}>
          <Text style={s.title}>創建帳號</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.container}>
        <Text style={s.label}>帳號</Text>
        <TextInput
          style={s.input}
          value={account}
          onChangeText={setAccount}
          placeholder="輸入 帳號"
          placeholderTextColor="#98A2B3"
          autoCapitalize="none"
        />

        <Text style={s.label}>密碼</Text>
        <TextInput
          style={s.input}
          value={password}
          onChangeText={setPassword}
          placeholder="輸入 密碼"
          placeholderTextColor="#98A2B3"
          secureTextEntry
        />
        {password.length > 0 && password.length < 6 && (
          <Text style={s.hintText}>密碼至少需 6 碼</Text>
        )}


        <TouchableOpacity
          style={[
            s.primaryBtn,
            (!(account && password) || password.length < 6) && s.primaryBtnDisabled,
          ]}
          onPress={onNext}
          activeOpacity={0.9}
          disabled={!(account && password) || password.length < 6}
        >
          <Text style={s.primaryText}>下一步</Text>
        </TouchableOpacity>



        <View style={s.sepRow}>
          <View style={s.sep} /><Text style={s.sepText}>or</Text><View style={s.sep} />
        </View>

        <TouchableOpacity style={s.googleBtn} onPress={continueWithGoogle} activeOpacity={0.9}>
          <Text style={s.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const PRIMARY = COLORS.primary;
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  back: { paddingHorizontal: 16, paddingVertical: 8 },
  container: { paddingHorizontal: 24, paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#6B8CFF', marginBottom: 16 },
  label: { marginTop: 12, marginBottom: 6, color: '#1F2937', fontWeight: '600' },
  input: {
    height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#C7D0E0',
    paddingHorizontal: 14, backgroundColor: '#FFF',
  },
  primaryBtn: {
    marginTop: 22, height: 48, borderRadius: 12, backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryText: { color: '#FFF', fontWeight: '700' },
  sepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22 },
  sep: { flex: 1, height: 1, backgroundColor: '#E4E7EC' },
  sepText: { color: '#98A2B3' },
  googleBtn: {
    marginTop: 16, height: 48, borderRadius: 12, backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
  },
  googleText: { color: '#FFF', fontWeight: '600' },
  primaryBtnDisabled: {backgroundColor: '#A5B4FC' },

  hintText: {
    color: '#EF4444', // 紅色警示
    fontSize: 12,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 12,
  },

  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },

  back: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6B8CFF',
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    width: 12,
    height: 12,
    transform: [{ rotate: '180deg' }], 
    tintColor: '#111', 
  },
});
