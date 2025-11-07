// src/features/Home/components/UploadButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActionSheetIOS, Platform, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function UploadButton({ onPicked }) {
  const openPhotoPicker = async () => {
    try {
      const res = await launchImageLibrary({
        selectionLimit: 0,           // 0 = 多選
        mediaType: 'photo',          // 只要照片
        includeBase64: false,
        includeExtra: true,          // iOS 拿到 fileName/assetId 較穩
        presentationStyle: 'fullScreen',
      });

      if (res.didCancel || res.errorCode) return;

      const items = (res.assets || []).map(a => ({
        kind: 'image',
        uri: a.uri,
        name: a.fileName || `image_${a.assetId || Date.now()}.jpg`,
        mime: a.type || 'image/jpeg',
        width: a.width,
        height: a.height,
        size: a.fileSize,
      }));

      onPicked?.(items); // 關鍵：回傳給父層
    } catch (e) {
      Alert.alert('選取圖片失敗', String(e?.message || e));
    }
  };

  const onPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['從相簿選擇', '取消'],
          cancelButtonIndex: 1,
          userInterfaceStyle: 'light',
        },
        (idx) => {
          if (idx === 0) openPhotoPicker();
        }
      );
    } else {
      openPhotoPicker();
    }
  };

  return (
    <TouchableOpacity style={styles.btn} activeOpacity={0.9} onPress={onPress}>
      <Text style={styles.icon}>🗂️</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  icon: { fontSize: 18 },
});
