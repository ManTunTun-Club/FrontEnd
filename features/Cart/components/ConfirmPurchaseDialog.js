import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const palette = {
  bg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
  primary: '#0A4174',
  primaryDim: '#274B62',
  line: '#D7E2EA',
  text: '#0F2430',
  subtext: '#466E8D',
  hintNeutral: 'rgba(183, 206, 220, 0.18)',
  hintError: 'rgba(239, 68, 68, 0.10)',
  hintSuccess: 'rgba(29, 78, 216, 0.07)',
};
const spacing = { xs: 6, sm: 8, md: 12, lg: 16 };
const radius = { sm: 8, md: 12, pill: 999 };

const FOOTER_HEIGHT = 56;

const ConfirmPurchaseDialog = ({ visible, item, onCancel, onConfirm }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (item) setAmount(item.price?.toString() ?? '');
  }, [item]);

  if (!visible || !item) return null;

  const handleChange = (v) => {
    if (v === '') return setAmount('');
    if (/^\d*\.?\d*$/.test(v)) setAmount(v);
  };

  const handleBlur = () => {
    if (amount && amount.endsWith('.')) setAmount(amount.slice(0, -1));
  };

  const cleaned = amount.trim();
  const numeric = Number(cleaned);
  const isValid = cleaned !== '' && !Number.isNaN(numeric) && numeric > 0;

  const submitIfValid = () => {
    if (isValid) onConfirm(numeric);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* 點背景關閉 */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          {/* 阻擋內層點擊冒泡關閉 */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.select({ ios: 'padding', android: undefined })}
              keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
              style={styles.dialogWrap}
            >
              {/* 內層點擊關鍵盤隱藏 */}
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                  {/* 頂部標題（已移除右上叉叉與那條區塊） */}
                  <View style={styles.headerRow}>
                    <Text style={styles.headerTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>

                  <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[styles.content, { paddingBottom: FOOTER_HEIGHT }]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    {/* 金額輸入列 */}
                    <View style={styles.amountPill}>
                      <Text style={styles.prefix}>NT$</Text>
                      <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={handleChange}
                        onBlur={handleBlur}
                        onSubmitEditing={submitIfValid}
                        placeholder="輸入金額"
                        placeholderTextColor="#B8C7D2"
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        selectTextOnFocus
                        accessible
                        accessibilityLabel="輸入金額"
                      />
                      {cleaned !== '' && (
                        <TouchableOpacity
                          onPress={() => setAmount('')}
                          style={styles.clearBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityRole="button"
                          accessibilityLabel="清除金額"
                        >
                          <Ionicons name="close-circle" size={18} color="#9FB4C2" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* 提示條 */}
                    <View
                      style={[
                        styles.hintBar,
                        cleaned === '' ? styles.hintNeutral : !isValid ? styles.hintError : styles.hintSuccess,
                      ]}
                    >
                      {cleaned === '' ? (
                        <Text style={styles.hintText}>請輸入實際購買金額</Text>
                      ) : !isValid ? (
                        <Text style={styles.hintText}>金額需大於 0</Text>
                      ) : (
                        <Text style={[styles.hintText, styles.hintTextStrong]}>
                          將以此金額扣除該類別額度
                        </Text>
                      )}
                    </View>
                  </ScrollView>

                  {/* 底部按鈕列 */}
                  <View style={styles.footer}>
                    <Pressable
                      onPress={onCancel}
                      style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnGhostPressed]}
                      android_ripple={{ color: '#E2E8F0' }}
                      accessibilityRole="button"
                      accessibilityLabel="取消"
                    >
                      <Text style={styles.btnGhostText}>取消</Text>
                    </Pressable>

                    <Pressable
                      onPress={submitIfValid}
                      disabled={!isValid}
                      style={({ pressed }) => [
                        styles.btn,
                        styles.btnPrimary,
                        !isValid && styles.btnPrimaryDisabled,
                        pressed && isValid && styles.btnPrimaryPressed,
                      ]}
                      android_ripple={{ color: '#164E63' }}
                      accessibilityRole="button"
                      accessibilityLabel="確認"
                    >
                      <Text style={[styles.btnPrimaryText, !isValid && styles.btnPrimaryTextDisabled]}>
                        確認
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

ConfirmPurchaseDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number,
  }),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  /** 全螢幕半透明背景（只當背景，不做置中） */
  overlay: {
    flex: 1,
    backgroundColor: palette.overlay,
  },

  /** 置中容器（負責水平垂直置中與安全距） */
  dialogWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },

  /** 對話框 */
  container: {
    width: '92%',
    maxWidth: 420,
    backgroundColor: palette.bg,
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '78%',
    minHeight: 236,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  /** 頂部標題（取代原本帶叉叉的那條） */
  headerRow: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.line,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },

  /** 內文容器 */
  content: {
    paddingHorizontal: 16,
    paddingTop: 28,        // 與標題區拉開距離
    paddingBottom: 20,     // 讓下方提示欄與按鈕之間更平衡
  },

  /** 金額輸入 */
  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  prefix: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.subtext,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  clearBtn: { marginLeft: 6 },

  /** 提示條 */
  hintBar: {
    marginTop: spacing.sm,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  hintNeutral: { backgroundColor: palette.hintNeutral },
  hintError: { backgroundColor: palette.hintError },
  hintSuccess: { backgroundColor: palette.hintSuccess },
  hintText: {
    fontSize: 12,
    color: palette.subtext,
    textAlign: 'center',
  },
  hintTextStrong: { fontWeight: '500' },

  /** 底部按鈕列 */
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.line,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: palette.bg,
  },
  btn: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
  },
  btnGhostPressed: { opacity: 0.92 },
  btnGhostText: {
    color: palette.primaryDim,
    fontSize: 14.5,
    fontWeight: '500',
  },
  btnPrimary: { backgroundColor: palette.primary },
  btnPrimaryPressed: { opacity: 0.94 },
  btnPrimaryDisabled: { backgroundColor: '#C9D8E2' },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
  },
  btnPrimaryTextDisabled: { color: '#6C8CA3' },
});

export default ConfirmPurchaseDialog;
