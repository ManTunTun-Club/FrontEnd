import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import BudgetChart from '../components/BudgetChart';
import BudgetTabs from '../components/BudgetTabs';
import BudgetCards from '../components/BudgetCards';
// 引入分離出去的 Modal
import AddCategoryModal from '../components/AddCategoryModal';
import { budgetApi } from '../../../services/budgetApi';
import { BUDGET_COLORS } from '../../../theme/theme-color';

const assignColorsByOrder = (categories) =>
  categories.map((c, idx) => ({
    id: c.id,
    name: c.name,
    amount: Number(c.amount) || 0,
    percentage: Number(c.percentage) || 0,
    spent: Number(c.spent) || 0,
    // 依索引循環分配顏色
    color: BUDGET_COLORS[idx % BUDGET_COLORS.length],
  }));

const BudgetScreen = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [selectedMonth, setSelectedMonth] = useState('8月');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // 控制 Modal 顯示與否
  const [showAddModal, setShowAddModal] = useState(false);

  const loadBudgetData = useCallback(async (month) => {
    try {
      setLoading(true);
      const [monthData, categories] = await Promise.all([
        budgetApi.getBudgetData(month),
        budgetApi.getCategories(),
      ]);

      const items = assignColorsByOrder(categories);
      const totalFromItems = items.reduce((sum, it) => sum + it.amount, 0);

      setData({
        // 優先使用子項目加總作為總預算，若無則用月份設定
        totalBudget: totalFromItems || monthData?.totalBudget || 0,
        items,
      });
    } catch (e) {
      console.error(e);
      Alert.alert('錯誤', '載入失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgetData(selectedMonth);
  }, [selectedMonth, loadBudgetData]);

  const currentItems = useMemo(() => data?.items || [], [data]);
  const totalBudget = data?.totalBudget ?? 0;

  // 處理從 AddCategoryModal 傳回來的資料
  const handleConfirmAddItem = useCallback(async (name, amountStr) => {
    const amountNum = parseInt(amountStr, 10);
    // 二次驗證 (Modal 其實已經驗過了)
    if (!name || isNaN(amountNum) || amountNum < 0) {
        Alert.alert('錯誤', '輸入資料無效');
        return;
    }

    try {
      // 呼叫 API
      await budgetApi.addCategory({
        name,
        amount: amountNum,
        percentage: 0,
        spent: 0,
      });
      // 關閉視窗並重新載入
      setShowAddModal(false);
      loadBudgetData(selectedMonth);
    } catch (e) {
      Alert.alert('錯誤', '新增分類失敗');
    }
  }, [loadBudgetData, selectedMonth]);

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BudgetChart
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        totalBudget={totalBudget}
        items={currentItems}
      />

      <BudgetTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 卡片列表：負責顯示與觸發「新增」事件 */}
      <BudgetCards
        items={currentItems}
        onAddItem={() => setShowAddModal(true)}
      />

      {/* 新增分類彈窗：獨立元件，負責 UI 與輸入驗證 */}
      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleConfirmAddItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BudgetScreen;