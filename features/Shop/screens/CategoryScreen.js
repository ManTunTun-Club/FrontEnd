import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyPage, ListSkeleton } from '../components';
import { CategoryButton } from '../components';
import { cartApi } from '../../../services/cartApi';

const NUM_COLUMNS = 3;
const H_PADDING = 16;  // 要和 styles.container 的左右 padding 一致
const V_GAP = 16;      // 列距
const H_GAP = 12;      // 欄距

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await cartApi.getCategories();
      setCategories(data || []);
    } catch (error) {
      Alert.alert('錯誤', '載入類別失敗');
      console.error('Load categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = useCallback((category) => {
    if (!category?.id || !category?.name) return;
    navigation.navigate('CartDetail', {
      categoryId: category.id,
      categoryName: category.name,
    });
  }, [navigation]);

  // 預設排序：createdAt（越早越前）；沒有 createdAt 的放後面
  const dataSorted = useMemo(() => {
    return [...(categories || [])].sort((a, b) => {
      const ad = a?.created_at ? new Date(a.created_at).getTime() : Number.POSITIVE_INFINITY;
      const bd = b?.created_at ? new Date(b.created_at).getTime() : Number.POSITIVE_INFINITY;

      if (ad !== bd) return ad - bd;
      // 次排序：name（避免同時間戳造成跳動）
      return String(a?.name || '').localeCompare(String(b?.name || ''));
    });
  }, [categories]);

  // 精準計算每格寬度（扣掉左右 padding 與欄距總和）
  const itemSize = useMemo(() => {
    const totalHSpacing = H_PADDING * 2 + H_GAP * (NUM_COLUMNS - 1);
    return Math.floor((width - totalHSpacing) / NUM_COLUMNS);
  }, [width]);

  const renderItem = ({ item, index }) => {
    if (!item) return null;
    const isLastCol = (index + 1) % NUM_COLUMNS === 0;
    return (
      <View
        style={{
          width: itemSize,
          marginRight: isLastCol ? 0 : H_GAP,
          marginBottom: V_GAP,
        }}
      >
        <CategoryButton
          category={item}
          onPress={handleCategoryPress}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>今天買點什麼好</Text>
        </View>
        <View style={[styles.container, styles.center]}>
          <ListSkeleton count={3} />
        </View>
      </SafeAreaView>
    );
  }

  if (dataSorted.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>今天買點什麼好</Text>
        </View>
        <View style={[styles.container, styles.center]}>
          <EmptyPage
            icon="🛍️"
            title="沒有類別"
            description="目前沒有任何類別"
            actionTitle="重新載入"
            onAction={loadCategories}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>今天買點什麼好</Text>
      </View>

      <FlatList
        data={dataSorted}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        // 效能微調
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
        // 讓滾動更平滑（粗略計算，對齊列高 + 列距）
        getItemLayout={(data, index) => ({
          length: itemSize + V_GAP,
          offset: Math.floor(index / NUM_COLUMNS) * (itemSize + V_GAP),
          index,
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FA' },
  container: { paddingHorizontal: H_PADDING, paddingTop: 16, paddingBottom: 40 },
  header: {
    padding: 16,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBF3',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#2A2F3A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CategoryScreen;