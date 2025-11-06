// src/features/Budget/components/AddCategoryModal.js

import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../theme/theme-color';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

const keepOnlyDigits = (s) => String(s ?? '').replace(/[^\d]/g, '');

// 新增 editItem 參數，用來接收要編輯的物件
const AddCategoryModal = ({ visible, onClose, onConfirm, editItem = null }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // 當彈窗打開時，判斷是「新增」還是「編輯」模式
  useEffect(() => {
    if (visible) {
      if (editItem) {
        // 編輯模式：帶入舊資料
        setName(editItem.name);
        setAmount(String(editItem.amount));
      } else {
        // 新增模式：清空欄位
        setName('');
        setAmount('');
      }
    }
  }, [visible, editItem]);

  const handleConfirm = () => {
    const cleanName = name.trim();
    const cleanAmount = keepOnlyDigits(amount);

    if (!cleanName) {
      Alert.alert('提醒', '請輸入類別名稱');
      return;
    }
    if (!cleanAmount) {
      Alert.alert('提醒', '請輸入預算金額');
      return;
    }

    onConfirm(cleanName, cleanAmount);
  };

  // 判斷標題要顯示什麼
  const title = editItem ? '編輯類別' : '新增類別';

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>類別名稱</Text>
            <TextInput
              style={styles.input}
              placeholder="輸入類別名稱"
              placeholderTextColor={COLORS.placeholder}
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>預算金額</Text>
            <TextInput
              style={styles.input}
              placeholder="輸入預算金額"
              placeholderTextColor={COLORS.placeholder}
              value={amount}
              onChangeText={(text) => setAmount(keepOnlyDigits(text))}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
              <Text style={styles.btnCancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={handleConfirm}>
              <Text style={styles.btnConfirmText}>確定</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  btnConfirm: { backgroundColor: '#4A90E2' },
  btnCancelText: { fontSize: 14, fontWeight: '600', color: '#666' },
  btnConfirmText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

export default AddCategoryModal;