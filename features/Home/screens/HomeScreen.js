
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import CategoryCard from '../components/CategoryCard';
import AddNewButton from '../components/AddNewButton';
import AddCategoryModal from '../components/AddCategoryModal';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 32 - 16) / 2;

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // 初始類別（可自由調整）
  const [categories, setCategories] = useState([
    { id: 'food',    title: '食物',     subtitle: '剛剛',  icon: '🍽️', route: 'AiChatbotHome' },
    { id: 'health',  title: '醫療',     subtitle: '2天前', icon: '➕',   route: 'AiChatbotHome' },
    { id: 'daily',   title: '生活用品', subtitle: '5天前', icon: '🧻',  route: 'AiChatbotHome' },
    { id: 'clothes', title: '服飾',     subtitle: '10天前',icon: '👚',  route: 'AiChatbotHome' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  // 你可在此做排序或過濾；目前直接回傳
  const sortedCategories = useMemo(() => categories, [categories]);

  const handlePressCategory = (item) => {
    navigation?.navigate(item.route, { categoryId: item.id, title: item.title });
  };

  const handleAddPress = () => setShowAddModal(true);

  const handleSaveNewCategory = (data) => {
    setCategories((prev) => [
      ...prev,
      {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle || '剛剛',
        icon: data.icon || '🧩',
        route: data.route || 'AiChatbotHome',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header（保持你既有風格） */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Budget</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: Math.max(12, insets.bottom + 84) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 方格卡片 */}
        <View style={styles.row}>
          {sortedCategories.map((c) => (
            <CategoryCard
              key={c.id}
              title={c.title}
              subtitle={c.subtitle}
              icon={c.icon}
              size={CARD_SIZE}
              // 你原本的 CategoryCard 支援 onPress / onPressCard；這裡用 onPressCard
              onPressCard={() => handlePressCategory(c)}
            />
          ))}
        </View>

        {/* 新增按鈕 */}
        <AddNewButton label="新增" onPress={handleAddPress} />
      </ScrollView>

      {/* 新增類別彈窗（由頁面控制狀態） */}
      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNewCategory}
        defaultSubtitle="剛剛"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F6F9' },
  container: { paddingHorizontal: 16, paddingTop: 20 },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 0, paddingBottom: 16, paddingHorizontal: 16,
    borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logoText: { marginTop:10, fontSize: 34, fontWeight: '800', letterSpacing: 1, color: '#4A90E2' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
});
