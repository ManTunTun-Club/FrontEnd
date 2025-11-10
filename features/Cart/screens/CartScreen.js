import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { EmptyPage, ListSkeleton } from '../components';
import { cartApi } from '../../../services/cartApi';
import CartItemCard from '../components/CartItemCard';
import AIBotDialog from '../components/AIBotDialog';
import ConfirmPurchaseDialog from '../components/ConfirmPurchaseDialog';
import { colors } from '../../../theme';

const CartScreen = ({ navigation, route }) => {
  // Safe area / Tab bar dimensions
  const insets = useSafeAreaInsets();
  const tabBarHeight =
    typeof useBottomTabBarHeight === 'function' ? useBottomTabBarHeight() : 56;
  const bottomPad = (insets?.bottom || 0) + (tabBarHeight || 0) + 16;

  // Provide default values to prevent route.params from being undefined
  const { categoryId = 'food', categoryName = '食物' } = route.params || {};
  const [categoryMeta, setCategoryMeta] = useState({ name: categoryName, icon: '' });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const [data, meta] = await Promise.all([
        cartApi.getItems(categoryId),
        cartApi.getCategory?.(categoryId).catch(() => null),
      ]);
      setItems(data.items || []);
      setRemainingBudget(data.remainingBudget || 0);
      if (meta?.name || meta?.icon) {
        setCategoryMeta({ name: meta.name ?? categoryName, icon: meta.icon ?? '' });
      } else {
        setCategoryMeta((prev) => ({ ...prev, name: categoryName }));
      }
    } catch (error) {
      Alert.alert('錯誤', '載入商品失敗');
      console.error('Load items error:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryName]);

  // 初次載入 & 切換類別時
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // 回到畫面時自動 revalidate
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  // ✅ 確認購買：樂觀更新（移除卡片＋扣掉餘額），再呼叫 API
  const handleConfirmPurchase = async (amount) => {
    const confirmed = selectedItem;
    setShowConfirmDialog(false);
    setSelectedItem(null);

    if (!confirmed) return;

    // 樂觀更新：先從畫面移除、先扣餘額
    setItems((prev) => prev.filter((it) => it.id !== confirmed.id));
    setRemainingBudget((prev) => Math.max(0, prev - Number(amount || 0)));

    try {
      const res = await cartApi.purchaseItem(categoryId, confirmed.id, Number(amount || 0));
      // 用 API 回傳的餘額校正（防止多工/浮點誤差）
      if (res?.remainingBudget !== undefined) {
        setRemainingBudget(res.remainingBudget);
      }
      Alert.alert('成功', `已添加 ${confirmed.title}，金額：NT$ ${amount}`);
    } catch (e) {
      console.error('purchaseItem error:', e);
      Alert.alert('錯誤', '更新購買狀態失敗，已重新整理清單');
      await loadItems(); // 回復正確狀態
    }
  };

  const handleCancelPurchase = () => {
    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const handleAIPress = () => {
    setShowAIDialog(true);
  };

  // 排序：order -> created_at -> title
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const ao = Number.isFinite(a?.order) ? a.order : Number.POSITIVE_INFINITY;
      const bo = Number.isFinite(b?.order) ? b.order : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;

      const ad = a?.created_at ? new Date(a.created_at).getTime() : Number.POSITIVE_INFINITY;
      const bd = b?.created_at ? new Date(b.created_at).getTime() : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

      return String(a?.title || '').localeCompare(String(b?.title || ''));
    });
  }, [items]);

  // Header
  const HeaderBar = (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2A2F3A" />
      </TouchableOpacity>
      <Text style={styles.title}>
        {/*{categoryMeta?.icon ? `${categoryMeta.icon} ` : ''}*/}
        {categoryMeta?.name ?? categoryName}
      </Text>
      <View style={styles.budgetInfo}>
        <Text style={styles.budgetText}>剩餘: ${remainingBudget}</Text>
      </View>
    </View>
  );

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        {HeaderBar}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
        >
          <ListSkeleton count={6} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Empty
  if (sortedItems.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        {HeaderBar}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.container,
            styles.centerContent,
            { flexGrow: 1, paddingBottom: bottomPad },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <EmptyPage
            icon={<Ionicons name="cart-outline" size={56} color="#9CA3AF" />}
            title="購物車是空的"
            description="還沒有添加任何商品"
            actionTitle="重新載入"
            onAction={loadItems}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Normal
  return (
    <>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {HeaderBar}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.sectionTitle}>商品清單</Text>
          {sortedItems.map((item) => (
            <CartItemCard key={item.id} item={item} onAskPurchase={handleItemPress} />
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.floatingAIButton,
            // 讓懸浮按鈕更貼近底部，不會太上面
            { bottom: (insets?.bottom || 0) + 3 },
          ]}
          onPress={handleAIPress}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={24} color={colors?.background || '#FFFFFF'} />
        </TouchableOpacity>
      </SafeAreaView>

      <AIBotDialog visible={showAIDialog} onClose={() => setShowAIDialog(false)} />

      <ConfirmPurchaseDialog
        visible={showConfirmDialog}
        item={selectedItem}
        onCancel={handleCancelPurchase}
        onConfirm={handleConfirmPurchase}
      />
    </>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FA' },
  container: { paddingHorizontal: 16, paddingTop: 16 },
  header: {
    padding: 16,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBF3',
    backgroundColor: '#F6F8FA',
  },
  backButton: { marginRight: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#2A2F3A', flex: 1 },
  budgetInfo: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  budgetText: { fontSize: 14, fontWeight: '600', color: '#1976D2' },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 12,
    color: '#2A2F3A',
    fontSize: 16,
    fontWeight: '700',
  },
  floatingAIButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A4174',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
});

export default CartScreen;
