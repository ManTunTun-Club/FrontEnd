import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function VoiceButton({ onPress, listening=false }) {
  return (
    <TouchableOpacity style={[styles.btn, listening && styles.active]} activeOpacity={0.9} onPress={onPress}>
      <Text style={styles.text}>{listening ? '●' : '🎤'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:{ width:44, height:44, borderRadius:22, backgroundColor:'#6d9ef9ff',
        alignItems:'center', justifyContent:'center',
        shadowColor:'#000', shadowOpacity:0.12, shadowRadius:10, shadowOffset:{width:0,height:5}, elevation:6 },
  active:{ backgroundColor:'#e02424' },
  text:{ fontSize:18, color:'#FFF' },
});

