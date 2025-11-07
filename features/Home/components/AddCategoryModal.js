import React, { useMemo, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const EMOJIS = [
  '🍽️','🛒','🧻','👚','👟','💄','🧴','🎁','🎮','📚','🏠','🚗',
  '🧹','💡','🪥','🍞','🥤','☕','🍰','🍜','🍕','🍔','🥗','🪙',
];

export default function AddCategoryModal({ visible, onClose, onSave, defaultSubtitle = '剛剛' }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [icon, setIcon] = useState(EMOJIS[0]);

  useEffect(() => {
    if (visible) {
      setTitle('');
      setSubtitle(defaultSubtitle);
      setIcon(EMOJIS[0]);
    }
  }, [visible, defaultSubtitle]);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const id = `cat-${Date.now()}`;
    onSave?.({
      id,
      title: title.trim(),
      subtitle: (subtitle || '').trim() || defaultSubtitle,
      icon,
      route: 'AiChatbotHome', // 與你的路由一致
    });
    onClose?.();
  };

  const EmojiItem = ({ item }) => {
    const active = item === icon;
    return (
      <TouchableOpacity
        onPress={() => setIcon(item)}
        style={[styles.emojiBox, active && styles.emojiActive]}
        activeOpacity={0.9}
      >
        <Text style={styles.emojiText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        {/* 背景點擊關閉 */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.sheet}>
            <Text style={styles.title}>新增類別</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>類別名稱</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="例如：旅遊、3C、娛樂"
                placeholderTextColor="#9AA6B2"
                style={styles.input}
                returnKeyType="done"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>副標（可選）</Text>
              <TextInput
                value={subtitle}
                onChangeText={setSubtitle}
                placeholder="例如：剛剛、昨天、上週…"
                placeholderTextColor="#9AA6B2"
                style={styles.input}
                returnKeyType="done"
              />
            </View>

            <Text style={[styles.label, { marginTop: 8 }]}>選擇 Icon</Text>
            <FlatList
              data={EMOJIS}
              keyExtractor={(e, i) => `${e}-${i}`}
              renderItem={EmojiItem}
              numColumns={8}
              contentContainerStyle={{ paddingVertical: 6 }}
            />

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelTxt}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, !canSubmit && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                <Text style={styles.saveTxt}>新增</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  sheet: {
    backgroundColor: '#FFF',
    padding: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
  },
  title: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 10 },

  inputGroup: { marginBottom: 10 },
  label: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },

  emojiBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#EEF5FF',
    alignItems: 'center', justifyContent: 'center',
    margin: 6,
  },
  emojiActive: { borderWidth: 2, borderColor: '#4A90E2', backgroundColor: '#E9F2FF' },
  emojiText: { fontSize: 22 },

  footerRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F1F5F9' },
  cancelTxt: { color: '#0F172A', fontWeight: '600' },
  saveBtn: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#4A90E2',
    shadowColor: '#4A90E2', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  saveTxt: { color: '#FFF', fontWeight: '800' },
});

