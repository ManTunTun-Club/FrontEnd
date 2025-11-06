import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import  Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const palette = {
  overlay: 'rgba(0,0,0,0.4)',
  background: '#FFFFFF',
  primary: '#0A4174',
  border: 'rgba(10,65,116,0.10)',
  bubbleUser: '#0A4174',
  bubbleBot: '#E7F0F6',
  placeholder: '#BDD8E9',
  text: '#0A4174',
};

const spacing = { xs: 6, sm: 8, md: 12, lg: 16 };
const radius = 16;
const FOOTER_HEIGHT = 72;
const MIN_INPUT_HEIGHT = 44;
const MAX_INPUT_HEIGHT = 120;

const INPUT_FONT = 15;
const LINE_HEIGHT = 20;

const AIBotDialog = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content:
        '你好！我是你的購物助理 \n我可以幫你分析商品、調整購買順序，或是提供建議！',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const scrollRef = useRef(null);

  const aiResponses = [
    '我根據你的偏好重新排好了購物順序，優先購買必要品 💡',
    '已依照性價比與折扣活動，幫你調整了購物清單的順序 👍',
    '根據你的偏好，我把高回饋信用卡適用的商品排在前面 💳',
  ];

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', content: text }]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    }
  }, [messages, visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.select({ ios: 'padding', android: undefined })}
              keyboardVerticalOffset={72}
              style={styles.centeredView}
            >
              <View style={styles.dialog}>
                {/* Top-right close button */}
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
                  <Ionicons name="close" size={18} color="#49769F" />
                </TouchableOpacity>

                {/* Message content */}
                <ScrollView
                  ref={scrollRef}
                  contentContainerStyle={{
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.lg + 6,
                    paddingBottom: FOOTER_HEIGHT + 12,
                  }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {messages.map((m) => (
                    <View
                      key={m.id}
                      style={[styles.msgRow, m.type === 'user' ? styles.rowRight : styles.rowLeft]}
                    >
                      <View
                        style={[styles.bubble, m.type === 'user' ? styles.bubbleUser : styles.bubbleBot]}
                      >
                        <Text
                          style={[styles.msgText, m.type === 'user' ? styles.textUser : styles.textBot]}
                        >
                          {m.content}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {isTyping && (
                    <View style={[styles.msgRow, styles.rowLeft]}>
                      <View style={[styles.bubble, styles.bubbleBot]}>
                        <Text style={styles.textBot}>AI 正在思考…</Text>
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* Footer input row */}
                <View style={styles.footer}>
                  <View style={styles.inputRow}>
                    {/* Relative positioning container: for absolutely centered placeholder */}
                    <View style={styles.inputWrap}>
                        {/* Custom placeholder (only show when no input) */}
                        {inputText.length === 0 && (
                          <Text pointerEvents="none" style={styles.placeholderOverlay}>
                            輸入訊息…
                          </Text>
                        )}

                        <TextInput
                          style={[
                            styles.input,
                            {
                              height: inputHeight,
                            },
                          ]}
                          value={inputText}
                          onChangeText={setInputText}
                          onContentSizeChange={(e) => {
                            const h = Math.min(
                              Math.max(e.nativeEvent.contentSize.height, MIN_INPUT_HEIGHT),
                              MAX_INPUT_HEIGHT
                            );
                            setInputHeight(h);
                          }}
                          multiline
                          returnKeyType="send"
                          onSubmitEditing={sendMessage}
                          placeholderTextColor={palette.placeholder}
                        />
                    </View>

                    <TouchableOpacity
                      onPress={sendMessage}
                      disabled={!inputText.trim() || isTyping}
                      style={[styles.sendBtn, (!inputText.trim() || isTyping) && styles.sendBtnDisabled]}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name="send"
                        size={18}
                        color={!inputText.trim() || isTyping ? '#BFD0DA' : '#FFFFFF'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

AIBotDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Styles area
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: palette.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dialog: {
    width: '94%',
    maxWidth: 520,
    minHeight: 420,
    maxHeight: '85%',
    borderRadius: radius,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0A4174',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EDF3F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  msgRow: { flexDirection: 'row', marginBottom: spacing.sm },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  bubbleBot: { backgroundColor: palette.bubbleBot, borderBottomLeftRadius: 6 },
  bubbleUser: { backgroundColor: palette.bubbleUser, borderBottomRightRadius: 6 },
  msgText: { fontSize: 14, lineHeight: 20 },
  textBot: { color: palette.text },
  textUser: { color: '#FFFFFF' },

  footer: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputWrap: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    minHeight: MIN_INPUT_HEIGHT,
  },

  input: {
    flex: 1,
    fontSize: INPUT_FONT,
    lineHeight: LINE_HEIGHT,
    color: palette.text,
    includeFontPadding: false,
    textAlignVertical: Platform.OS === 'ios' ? 'top' : 'center',
    paddingTop: Platform.OS === 'ios' ? (MIN_INPUT_HEIGHT - LINE_HEIGHT) / 2 - 1 : 0,
    paddingBottom: 0,
    maxHeight: MAX_INPUT_HEIGHT,
  },

  placeholderOverlay: {
    position: 'absolute',
    left: 0,
    color: palette.placeholder,
    fontSize: INPUT_FONT,
    lineHeight: LINE_HEIGHT,
    // Completely follow input's paddingTop + lineHeight alignment logic
    top: Platform.OS === 'ios'
      ? (MIN_INPUT_HEIGHT - LINE_HEIGHT) / 2 - 1
      : (MIN_INPUT_HEIGHT - LINE_HEIGHT) / 2,
  },

  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#C9D8E2' },
});

export default AIBotDialog;