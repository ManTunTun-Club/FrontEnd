import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddItemButton = ({ onPress, height = 120 }) => {
  return (
    <TouchableOpacity
      style={[styles.addButton, { height }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="新增類別"
    >
      <Text style={styles.addButtonText}>+</Text>
      <Text style={styles.addButtonLabel}>新增類別</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    // height 由 props 傳入覆寫
  },
  addButtonText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#bbb',
    marginBottom: 8,
    lineHeight: 56, // 微調垂直置中
  },
  addButtonLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
});

export default AddItemButton;