// src/features/Budget/components/BudgetItem.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// 1. 引入 useNavigation hook
import { useNavigation } from '@react-navigation/native';

const hexToRgba = (hex, alpha) => {
  if (!hex || !hex.startsWith('#') || hex.length < 7) {
    return `rgba(200,200,200,${alpha})`;
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const BudgetItem = ({ item, height = 120, onEdit }) => {
  // 2. 取得 navigation 物件
  const navigation = useNavigation();

  const color = item.color || '#E0E0E0';
  const remainingPct = item.percentage || 0;
  const juiceHeight = (remainingPct / 100) * height;

  return (
    <View style={[styles.itemCard, { height }]}>
      <View style={[styles.juiceBackground, { backgroundColor: hexToRgba(color, 0.15) }]}>
        <View style={[styles.juiceFill, { height: juiceHeight, backgroundColor: color }]} />
      </View>

      <View style={styles.contentLayer}>
        <View style={styles.infoSection}>
          <View style={styles.leftInfo}>
            <Text style={styles.amount}>${Number(item.amount || 0).toLocaleString()}</Text>
            <Text style={styles.categoryName} numberOfLines={1}>
              {item.name || '未命名'}
            </Text>
          </View>
          <Text style={styles.percentage}>{remainingPct}%</Text>
        </View>

        <View style={styles.buttonSection}>
          {/* 3. 修改眼睛按鈕：導航到購物車頁面，並傳遞目前的分類資料 */}
          <TouchableOpacity 
            style={styles.viewButton} 
            onPress={() => navigation.navigate('CategoryCart', { category: item })}
          >
             <Image source={require('../../../assets/icons/eye.png')} style={styles.buttonIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit?.(item)}>
             <Image source={require('../../../assets/icons/edit.png')} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
  },
  juiceBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'flex-end',
  },
  juiceFill: {
    width: '100%',
  },
  contentLayer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    padding: 12,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  editButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default BudgetItem;