import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { EmptyPage, ListSkeleton } from '../components';
import { cartApi } from '../../../services/cartApi';
import CartItemCard from '../components/CartItemCard';
// import CartHeader from '../components/CartHeader';
import AIBotDialog from '../components/AIBotDialog';
import ConfirmPurchaseDialog from '../components/ConfirmPurchaseDialog';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  responsiveWidth,
  responsiveHeight,
  getResponsiveValue,
} from '../../../theme';

const CartScreen = ({ navigation, route }) => {
  // Safe area / Tab bar dimensions
  const insets = useSafeAreaInsets();
  const tabBarHeight =
    typeof useBottomTabBarHeight === 'function' ? useBottomTabBarHeight() : 56;
  const bottomPad = (insets?.bottom || 0) + (tabBarHeight || 0) + 16;

  // Provide default values to prevent route.params from being undefined
  const { categoryId = 'food', categoryName = '食物' } = route.params || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await cartApi.getItems(categoryId);
      setItems(data.items || []);
      setRemainingBudget(data.remainingBudget || 0);
    } catch (error) {
      Alert.alert('錯誤', '載入商品失敗');
      console.error('Load items error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  const handleConfirmPurchase = (amount) => {
    setShowConfirmDialog(false);
    setSelectedItem(null);
    Alert.alert('成功', `已添加 ${selectedItem?.title}，金額：NT$ ${amount}`);
    loadItems();
  };

  const handleCancelPurchase = () => {
    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const handleAIPress = () => {
    setShowAIDialog(true);
  };

  // Header (shared)
  const HeaderBar = (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2A2F3A" />
      </TouchableOpacity>
      <Text style={styles.title}>{categoryName}</Text>
      <View style={styles.budgetInfo}>
        <Text style={styles.budgetText}>剩餘: ${remainingBudget}</Text>
      </View>
    </View>
  );

  // Loading screen
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

  // Empty list screen
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        {HeaderBar}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
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

  // Normal screen
  return (
    <>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {HeaderBar}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>商品清單</Text>
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} onAskPurchase={handleItemPress} />
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.floatingAIButton,
              { bottom: tabBarHeight - 60 },
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
  container: { paddingHorizontal: 16, paddingTop: 16 }, // paddingBottom handled by bottomPad dynamic calculation
  header: {
    padding: 16,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBF3',
    backgroundColor: '#F6F8FA',
  },
  backButton: {
    marginRight: 12,
  },
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
});

export default CartScreen;