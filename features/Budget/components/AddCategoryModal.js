import React, { useState, useEffect } from 'react';
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

/** 僅保留數字字元 */
const digitsOnly = (s) => String(s ?? '').replace(/[^\d]/g, '');

const AddCategoryModal = ({ visible, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // 當 Modal 打開時，清空欄位 (Optional，看你習慣)
  useEffect(() => {
    if (visible) {
      setName('');
      setAmount('');
    }
  }, [visible]);

  const handleConfirm = () => {
    const cleanName = name.trim();
    const cleanAmount = digitsOnly(amount);

    if (!cleanName) {
      Alert.alert('提醒', '請輸入類別名稱');
      return;
    }
    if (!cleanAmount) {
      Alert.alert('提醒', '請輸入預算金額');
      return;
    }

    // 將驗證過的資料傳回父層，父層負責呼叫 API
    onConfirm(cleanName, cleanAmount);
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      {/* 點擊背景關閉 */}
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {/* 阻擋點擊事件冒泡到背景 */}
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>新增類別</Text>

          {/* 類別名稱 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>類別名稱</Text>
            <TextInput
              style={styles.input}
              placeholder="輸入類別名稱"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
            />
          </View>

          {/* 預算金額 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>預算金額</Text>
            <TextInput
              style={styles.input}
              placeholder="輸入預算金額"
              placeholderTextColor="#ccc"
              value={amount}
              onChangeText={(text) => setAmount(digitsOnly(text))}
              keyboardType="number-pad"
            />
          </View>

          {/* 按鈕列 */}
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