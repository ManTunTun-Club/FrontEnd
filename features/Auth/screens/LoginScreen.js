import React from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../App';
import { COLORS } from '../../../theme/theme-color';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [account, setAccount] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onLogin = () => {
    // TODO: 驗證後：
    signIn();
  };

  return (
    <LinearGradient colors={['#6CB9FF', '#E9EEF9']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ↑ 上方品牌列 */}
          <View style={styles.brandWrap}>
            <Image
              source={require('../../../assets/icons/footer_logo.png')}
              style={[styles.brandIcon, { tintColor: '#FFFFFF' }]}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>捌集免驚</Text>
          </View>

          {/* 白色卡片 */}
          <View style={styles.card}>
            <Text style={styles.title}>歡迎回來！</Text>

            <Text style={styles.label}>帳號</Text>
            <TextInput
              value={account}
              onChangeText={setAccount}
              placeholder="輸入帳號"
              placeholderTextColor="#9AA4B2"
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>密碼</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="輸入密碼"
              placeholderTextColor="#9AA4B2"
              style={styles.input}
              secureTextEntry
            />

            <TouchableOpacity style={[styles.btn, { alignSelf: 'center', width: '86%' }]} onPress={onLogin} activeOpacity={0.8}>
              <Text style={styles.btnText}>登入</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 106 }}>
                <Text style={styles.footerText}>
                    還未有帳號？ <Text style={styles.linkText} onPress={() => navigation.navigate('SignupAccount')}>註冊</Text>
                </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const PRIMARY = COLORS.primary;
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 48,
    justifyContent: 'center',         
  },

  brandWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 28,                
  },
  brandIcon: { width: 20, height: 20 },
  brandText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

  // 卡片
  card: {
    alignSelf: 'center',
    width: '88%',                     
    maxWidth: 360,                    
    backgroundColor: '#FFFFFF',
    borderRadius: 20,                 
    padding: 22,                     
    shadowColor: '#000',
    shadowOpacity: 0.08,            
    shadowRadius: 10,             
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  title: {
    textAlign: 'center',
    fontSize: 20,                   
    fontWeight: '800',
    marginBottom: 18,                  
    color: '#0F172A',
  },

  label: {
    marginTop: 14,                    
    marginBottom: 6,
    color: '#334155',
    fontSize: 14,
    fontWeight: '600'
  },

  input: {
    height: 50,                        
    borderWidth: 1.25,                 
    borderColor: '#C9D2E3',            
    borderRadius: 12,                 
    paddingHorizontal: 14,            
    backgroundColor: '#FFFFFF',
  },

  btn: {
      marginTop: 22,
      height: 50,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: PRIMARY,
  },

  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

  footerText: { color: '#475569', marginTop: 12 },
  linkText: { color: PRIMARY, fontWeight: '700' },
});