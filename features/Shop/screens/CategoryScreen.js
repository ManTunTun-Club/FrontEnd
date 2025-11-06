import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyPage, ListSkeleton } from '../components';
import { CategoryButton } from '../components';
import { cartApi } from '../../../services/cartApi';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await cartApi.getCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert('錯誤', '載入類別失敗');
      console.error('Load categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    if (!category || !category.id || !category.name) return;
    navigation.navigate('CartDetail', { 
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const renderCategoryItem = ({ item }) => {
    if (!item) return null;
    return (
      <CategoryButton
        category={item}
        onPress={handleCategoryPress}
        style={styles.categoryButton}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>今天買點什麼好</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <ListSkeleton count={3} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (categories.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>今天買點什麼好</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <EmptyPage
            icon="🛍️"
            title="沒有類別"
            description="目前沒有任何類別"
            actionTitle="重新載入"
            onAction={loadCategories}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>今天買點什麼好</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.sectionTitle}>選擇分類</Text> */}

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FA' },
  container: { padding: 16, paddingBottom: 40 },
  header: {
    padding: 16,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBF3',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#2A2F3A' },
  sectionTitle: { marginTop: 16, marginBottom: 16, color: '#2A2F3A', fontSize: 16, fontWeight: '700' },
  listContent: { paddingBottom: 20 },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    flex: 0.32,
  },
});

export default CategoryScreen;
