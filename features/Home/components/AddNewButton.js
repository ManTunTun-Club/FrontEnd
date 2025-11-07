import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


/**
* 新增按鈕（整塊可按，Screen 端只要傳 label / onPress）
*/
export default function AddNewButton({ label = '新增', onPress }) {
 return (
   <TouchableOpacity style={styles.addBtn} activeOpacity={0.9} onPress={onPress}>
     <Text style={styles.addPlus}>＋</Text>
     <Text style={styles.addText}>{label}</Text>
   </TouchableOpacity>
 );
}


const styles = StyleSheet.create({
 addBtn: {
   marginTop: 28,
   alignSelf: 'center',
   height: 56,
   paddingHorizontal: 26,
   borderRadius: 28,
   backgroundColor: '#FFFFFF',
   flexDirection: 'row',
   alignItems: 'center',
   gap: 8,
   shadowColor: '#000',
   shadowOpacity: 0.20,
   shadowRadius: 8,
   shadowOffset: { width: 0, height: 4 },
   elevation: 4,
 },
 addPlus: { fontSize: 22, color: '#1E2430' },
 addText: { fontSize: 18, color: '#1E2430', fontWeight: '600' },
});
