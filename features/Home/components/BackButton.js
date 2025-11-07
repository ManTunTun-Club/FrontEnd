import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.btn} activeOpacity={0.9} onPress={onPress}>
      <Text style={styles.icon}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40, height: 40, borderRadius: 20,
    marginTop:10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  icon: { fontSize: 18, color: '#111827', marginTop: -1 },
});

