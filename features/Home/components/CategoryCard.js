import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';


/**
* 通用方格卡片（整塊可按）
* Props:
* - title, subtitle
* - icon 或 iconSource
* - size
* - onPressCard?: () => void   // 建議用這個命名
* - onPress?: () => void       // 舊參數，仍相容
*/
export default function CategoryCard({
 title,
 subtitle,
 icon,
 iconSource,
 size = 160,
 onPressCard,
 onPress,
}) {
 const handlePress = onPressCard || onPress;
 return (
   <TouchableOpacity
     activeOpacity={0.85}
     onPress={handlePress}
     style={[styles.card, { width: size, height: size }]}
   >
     <View style={styles.iconWrap}>
       {iconSource ? (
         <Image source={iconSource} style={styles.iconImg} resizeMode="contain" />
       ) : (
         <Text style={styles.iconEmoji}>{icon ?? '🧩'}</Text>
       )}
     </View>
     <Text style={styles.title}>{title}</Text>
     {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
   </TouchableOpacity>
 );
}


const styles = StyleSheet.create({
 card: {
   backgroundColor: '#FFFFFF',
   borderRadius: 14,
   padding: 14,
   alignItems: 'center',
   justifyContent: 'center',
   shadowColor: '#000', shadowOpacity: 0.20, shadowRadius: 8,
   shadowOffset: { width: 0, height: 3 }, elevation: 4,
 },
 iconWrap: {
   width: 64, height: 64, borderRadius: 18, backgroundColor: '#EEF5FF',
   alignItems: 'center', justifyContent: 'center', marginBottom: 10,
 },
 iconEmoji: { fontSize: 32 },
 iconImg: { width: 36, height: 36 },
 title: { fontSize: 16, color: '#4A90E2', fontWeight: '700', marginBottom: 2 },
 subtitle: { fontSize: 12, color: '#92A1B2' },
});

