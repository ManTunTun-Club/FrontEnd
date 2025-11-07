// src/features/Budget/components/AddCategoryModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const onlyDigits = (s = '') => s.replace(/[^\d]/g, ''); // 只保留 0-9

const AddCategoryModal = ({
  visible,
  onClose,
  onConfirm,         // onConfirm(name, amountText)
  editItem = null,   // { id, name, amount } | null
}) => {
  const [name, setName] = useState('');
  const [amountText, setAmountText] = useState(''); // 只存純數字字串

  useEffect(() => {
    if (visible) {
      if (editItem) {
        setName(editItem.name ?? '');
        // 預填時也轉為純數字（避免舊資料含逗號）
        const preset = String(editItem.amount ?? '');
        setAmountText(onlyDigits(preset));
      } else {
        setName('');
        setAmountText('');
      }
    }
  }, [visible, editItem]);

  const handleAmountChange = (text) => {
    // 即時過濾：使用者打任何字母、符號都會被移除
    const digits = onlyDigits(text);
    setAmountText(digits);
  };

  const handleConfirm = () => {
    // 直接把純數字字串交給父層；父層已做 Number 檢查
    onConfirm?.(name?.trim() ?? '', amountText ?? '');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.center}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{editItem ? '編輯類別' : '新增類別'}</Text>

          <Text style={styles.label}>類別名稱</Text>
          <TextInput
            placeholder="輸入類別名稱"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#ccc"
            returnKeyType="next"
          />

          <Text style={styles.label}>預算金額</Text>
          <TextInput
            placeholder="輸入預算金額（僅數字）"
            value={amountText}
            onChangeText={handleAmountChange}
            keyboardType={Platform.select({ ios: 'number-pad', android: 'number-pad' })}
            // Android 有時仍可輸入非數字，故我們用 onChangeText 再過濾一層
            // iOS 也可能透過貼上帶入符號，同樣會被過濾
            style={styles.input}
            placeholderTextColor="#ccc"
            maxLength={12} // 避免過長，依需求可調
          />

          <View style={styles.row}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.cancel]}>
              <Text style={styles.btnTextGray}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={[styles.btn, styles.ok]}>
              <Text style={styles.btnText}>確定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '86%', backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#222',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  btn: { flex: 1, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cancel: { backgroundColor: '#f2f2f2', marginRight: 10 },
  ok: { backgroundColor: '#4A90E2', marginLeft: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
  btnTextGray: { color: '#666', fontWeight: '600' },
});

export default AddCategoryModal;
