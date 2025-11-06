// src/features/Budget/screens/BudgetCategoryScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image, 
} from 'react-native';
import BudgetGauge from '../components/BudgetGauge';
import { budgetApi } from '../../../services/budgetApi';


const CartItemCard = ({ item, color }) => {
  const isPurchased = item.status === 'purchased';

  const statusColor = isPurchased ? color : hexToRgba(color, 0.5); 

  return (
    <View style={styles.card}>
      
      <View style={[styles.productImage, { backgroundColor: '#eee' }]}>
    
          <Text style={{color: '#999'}}>商品圖</Text>
      </View>

      {/* 商品資訊 */}
      <View style={styles.cardInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🛍️ {item.source}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>💳 {item.paymentMethod}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: statusColor }]}>
            $ {item.price.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* 底部狀態列 */}
      <View style={styles.cardFooter}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {isPurchased ? '已購買' : '預計購買'}
        </Text>
        <Text style={styles.dateText}>日期: {item.date}</Text>
      </View>
    </View>
  );
};

const BudgetCategoryScreen = ({ route, navigation }) => {
  // 從導航參數中取得傳過來的分類資料
  const { category } = route.params || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category?.id) {
      loadItems();
    }
  }, [category]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await budgetApi.getCategoryCartItems(category.id);
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 計算各項金額
  const spent = items
    .filter(i => i.status === 'purchased')
    .reduce((sum, i) => sum + i.price, 0);
  const planned = items
    .filter(i => i.status === 'planned')
    .reduce((sum, i) => sum + i.price, 0);

  if (!category) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}購物車</Text>
        <View style={{ width: 40 }} /> {/* 佔位用 */}
      </View>

      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.gaugeContainer}>
            <BudgetGauge
              totalBudget={category.amount}
              spent={spent}
              planned={planned}
              color={category.color}
              size={320}
            />
          </View>
        }
        renderItem={({ item }) => <CartItemCard item={item} color={category.color} />}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>此類別尚無商品</Text>
        }
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={category.color} />
        </View>
      )}
    </SafeAreaView>
  );
};

const hexToRgba = (hex, alpha = 1) => {
    if (!hex || !hex.startsWith('#') || hex.length < 7) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: { padding: 8 },
  backText: { fontSize: 24, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listContent: { padding: 16 },
  gaugeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },
  // 商品卡片樣式
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap', 
  },
  productImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  realImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  metaRow: { marginBottom: 4 },
  metaText: { fontSize: 12, color: '#666' },
  priceRow: { marginTop: 8 },
  price: { fontSize: 18, fontWeight: 'bold' },
  cardFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  statusText: { fontSize: 14, fontWeight: '600' },
  dateText: { fontSize: 14, color: '#999' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BudgetCategoryScreen;