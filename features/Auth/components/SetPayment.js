import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PRIMARY = '#49B0F8';
const CARD = 'card';
const THIRD = 'third';

const DEFAULT_CARD_COMPANIES = ['玉山銀行', '台新銀行', '永豐銀行', '國泰世華', '富邦銀行'];
const DEFAULT_THIRD = ['Apple Pay', 'LINE Pay', 'JKoPay', '街口支付', '悠遊付'];

export default function SetPayment({
  visible,
  onClose,
  onSubmit,
  cardCompanies = DEFAULT_CARD_COMPANIES,
  thirdProviders = DEFAULT_THIRD,
  loadCardTypes, // (bank: string) => Promise<string[]>
}) {
  const [method, setMethod] = useState(null);  // 'card' | 'third' | null
  const [cardCompany, setCardCompany] = useState('');
  const [cardType, setCardType] = useState('');
  const [thirdProvider, setThirdProvider] = useState('');

  // 動態卡別
  const [cardTypeList, setCardTypeList] = useState([]);     // string[]
  const [loadingTypes, setLoadingTypes] = useState(false);  // boolean
  const [loadError, setLoadError] = useState(null);         // string | null

  // 選了銀行就載入卡別
  useEffect(() => {
    if (method !== CARD) return;
    if (!cardCompany) { setCardTypeList([]); setCardType(''); setLoadError(null); return; }

    if (!loadCardTypes) { // 沒提供 API：維持文字輸入模式
      setCardTypeList([]);
      setLoadError(null);
      return;
    }
    setLoadingTypes(true);
    setLoadError(null);
    setCardType('');
    loadCardTypes(cardCompany)
      .then(list => {
        setCardTypeList(Array.isArray(list) ? list : []);
      })
      .catch(() => setLoadError('載入失敗，可改手動輸入'))
      .finally(() => setLoadingTypes(false));
  }, [method, cardCompany, loadCardTypes]);

  const canConfirm = useMemo(() => {
    if (method === CARD) return !!cardCompany && !!cardType.trim();
    if (method === THIRD) return !!thirdProvider;
    return false;
  }, [method, cardCompany, cardType, thirdProvider]);

  const reset = () => {
    setMethod(null);
    setCardCompany('');
    setCardType('');
    setThirdProvider('');
    setCardTypeList([]);
    setLoadingTypes(false);
    setLoadError(null);
  };

  const handleClose = () => { reset(); onClose?.(); };

  const handleConfirm = () => {
    if (!canConfirm) return;
    if (method === CARD) {
      onSubmit?.({ method: CARD, cardCompany, cardType: cardType.trim() });
    } else {
      onSubmit?.({ method: THIRD, thirdProvider });
    }
    reset();
    onClose?.();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.mask}>
        <KeyboardAvoidingView
          style={styles.sheet}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <Text style={styles.title}>新增支付方式</Text>

          {/* Step 1：選類型 */}
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentBtn, method === CARD && styles.segmentBtnActive]}
              onPress={() => setMethod(CARD)}
            >
              <Text style={[styles.segmentText, method === CARD && styles.segmentTextActive]}>信用卡</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, method === THIRD && styles.segmentBtnActive]}
              onPress={() => setMethod(THIRD)}
            >
              <Text style={[styles.segmentText, method === THIRD && styles.segmentTextActive]}>第三方支付</Text>
            </TouchableOpacity>
          </View>

          {/* Step 2：依選擇顯示欄位 */}
          {method === CARD && (
            <View style={{ gap: 12 }}>
              <Text style={styles.label}>發卡行</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={cardCompany} onValueChange={setCardCompany}>
                  <Picker.Item label="請選擇發卡行" value="" />
                  {cardCompanies.map(c => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
              </View>

              <Text style={styles.label}>卡別</Text>

              {/* 載入中 */}
              {loadingTypes && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator />
                  <Text style={{ marginLeft: 8, color: '#6B7280' }}>載入中…</Text>
                </View>
              )}

              {/* 有清單 → Picker；否則 → 文字輸入（後備） */}
              {!loadingTypes && cardCompany && cardTypeList.length > 0 && !loadError && (
                <View style={styles.pickerWrap}>
                  <Picker selectedValue={cardType} onValueChange={setCardType}>
                    <Picker.Item label="請選擇卡別" value="" />
                    {cardTypeList.map(t => <Picker.Item key={t} label={t} value={t} />)}
                  </Picker>
                </View>
              )}

              {/* 載入失敗或沒提供 API → 後備輸入框 */}
              {(!loadingTypes && cardCompany && (!!loadError || cardTypeList.length === 0)) && (
                <>
                  {loadError ? <Text style={styles.hint}>{loadError}</Text> : null}
                  <TextInput
                    value={cardType}
                    onChangeText={setCardType}
                    placeholder="輸入卡別（例如：至尊黑卡、FlyGo…）"
                    style={styles.input}
                    returnKeyType="done"
                  />
                </>
              )}
            </View>
          )}

          {method === THIRD && (
            <View style={{ gap: 12 }}>
              <Text style={styles.label}>選擇第三方支付</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={thirdProvider} onValueChange={setThirdProvider}>
                  <Picker.Item label="請選擇" value="" />
                  {thirdProviders.map(p => <Picker.Item key={p} label={p} value={p} />)}
                </Picker>
              </View>
            </View>
          )}

          {/* 底部操作 */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!canConfirm}
              style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
            >
              <Text style={styles.confirmText}>確認新增</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: { width: '100%', borderRadius: 16, padding: 18, backgroundColor: '#fff', gap: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#111' },

  segment: { flexDirection: 'row', backgroundColor: '#F1F4FA', borderRadius: 12, padding: 4, gap: 6 },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: PRIMARY },
  segmentText: { fontSize: 14, color: '#4B5563', fontWeight: '600' },
  segmentTextActive: { color: '#fff' },

  label: { fontSize: 13, color: '#6B7280' },
  input: { height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FAFBFF' },
  pickerWrap: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden', backgroundColor: '#FAFBFF' },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },

  hint: { color: '#EF4444', fontSize: 12 },

  footer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 20, marginBottom: 10 },
  cancelBtn: { paddingHorizontal: 14, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  cancelText: { color: '#111827', fontWeight: '600' },
  confirmBtn: { paddingHorizontal: 16, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  confirmBtnDisabled: { backgroundColor: '#D1D5DB' },
  confirmText: { color: '#fff', fontWeight: '700' },
});
