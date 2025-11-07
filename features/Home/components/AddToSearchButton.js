import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AddToCartBar({ visible, productName, onAdd, onDismiss }) {
  if (!visible) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text numberOfLines={1} style={styles.label}>
          加入購物車：<Text style={styles.name}>{productName}</Text>
        </Text>
        <View style={{flexDirection:'row', gap:8}}>
          <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss} activeOpacity={0.9}>
            <Text style={styles.dismissTxt}>稍後</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.9}>
            <Text style={styles.addTxt}>加入</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position:'absolute', left:12, right:12, bottom:92, // 避開 InputBar
  },
  card: {
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:14, paddingVertical:12,
    borderRadius:16, backgroundColor:'#FFFFFF',
    shadowColor:'#000', shadowOpacity:0.08, shadowRadius:10, shadowOffset:{width:0,height:4}, elevation:5,
  },
  label: { fontSize:14, color:'#475569', flex:1, marginRight:10 },
  name: { fontWeight:'800', color:'#0F172A' },
  addBtn: {
    backgroundColor:'#4A90E2', paddingHorizontal:16, paddingVertical:10, borderRadius:12,
    shadowColor:'#4A90E2', shadowOpacity:0.25, shadowRadius:6, shadowOffset:{width:0,height:3},
  },
  addTxt: { color:'#FFF', fontWeight:'800' },
  dismissBtn: { backgroundColor:'#F1F5F9', paddingHorizontal:14, paddingVertical:10, borderRadius:12 },
  dismissTxt: { color:'#0F172A', fontWeight:'700' },
});

