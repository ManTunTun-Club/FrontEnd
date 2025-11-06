// features/Profile/components/SettingItem.js
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

export default function SettingItem({
  label,
  onPress,
  showDivider = true,
}) {
  return (
    <>
      <Pressable style={styles.row} onPress={onPress}>
        <Text style={styles.left}>{label}</Text>
        <Image
          source={require('../../../assets/icons/arrow-right-2.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  left: { 
    fontSize: 16, 
    color: '#2A2F3A', 
    fontWeight: '600' 
},
  icon: { 
    width: 12, 
    height: 12, 
    tintColor: '#000000ff' 
},
});
