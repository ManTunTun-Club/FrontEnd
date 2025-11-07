// src/features/Home/components/InputBar.js
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

export default function InputBar({
  value,
  onChangeText,
  onSend,
  placeholder = '輸入訊息…',
  imagesPreview = [],                 // [{uri,name,width,height,mime,size}]
  onRemoveImage,                      // (index) => void
}) {
  const canSend = (value?.trim()?.length ?? 0) > 0 || imagesPreview.length > 0;

  const handleSendPress = () => {
    onSend?.(value ?? '');
  };

  return (
    <View style={styles.wrapper}>
      {/* 預覽列 */}
      {imagesPreview.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.previewRow}
        >
          {imagesPreview.map((img, idx) => (
            <View key={`${img.uri}-${idx}`} style={styles.thumbWrap}>
              <Image source={{ uri: img.uri }} style={styles.thumb} />
              <TouchableOpacity
                style={styles.thumbClose}
                activeOpacity={0.8}
                onPress={() => onRemoveImage?.(idx)}
              >
                <Text style={styles.thumbCloseText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 輸入列 */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9BA4AE"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !canSend && { opacity: 0.5 }]}
          onPress={handleSendPress}
          activeOpacity={0.85}
        >
          <Text style={styles.sendText}>送出</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 8,
  },
  previewRow: {
    paddingLeft: 6,
    paddingRight: 6,
    gap: 8,
  },
  thumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#EAF0FF',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbClose: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbCloseText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '700',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingVertical: 6,
    paddingRight: 8,
    color: '#22324A',
    fontSize: 16,
  },
  sendBtn: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

