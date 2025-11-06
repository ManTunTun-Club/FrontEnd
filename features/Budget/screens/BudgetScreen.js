// src/features/Budget/screens/BudgetScreen.js

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
import AddCategoryModal from '../components/AddCategoryModal';
import { budgetApi } from '../../../services/budgetApi';
import { BUDGET_COLORS } from '../../../theme/theme-color';

const assignColorsAndCalculatePercentage = (categories) =>
  categories.map((c, idx) => {
    const amount = Number(c.amount) || 0;
    const spent = Number(c.spent) || 0;
    let remainingPct = 0;
    if (amount > 0) {
      remainingPct = Math.round(((amount - spent) / amount) * 100);
    }
    remainingPct = Math.max(0, Math.min(100, remainingPct));

    return {
      id: c.id,
      name: c.name,
      amount,
      spent,
      percentage: remainingPct,
      color: BUDGET_COLORS[idx % BUDGET_COLORS.length],
    };
  });

const BudgetScreen = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [selectedMonth, setSelectedMonth] = useState('8月');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // 改名為 showModal 比較通用
  const [editingCategory, setEditingCategory] = useState(null); // 新增：記錄正在編輯的類別

  const loadBudgetData = useCallback(async (month) => {
    try {
      setLoading(true);
      const [monthData, categoriesRaw] = await Promise.all([
        budgetApi.getBudgetData(month),
        budgetApi.getCategories(),
      ]);

      const totalFromItems = categoriesRaw.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
      const finalTotalBudget = totalFromItems || monthData?.totalBudget || 0;
      const items = assignColorsAndCalculatePercentage(categoriesRaw);

      setData({ totalBudget: finalTotalBudget, items });
    } catch (e) {
      console.error('載入失敗', e);
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

  // 處理點擊「新增」按鈕
  const handleAddItemClick = useCallback(() => {
    setEditingCategory(null); // 清空編輯狀態，代表是新增
    setShowModal(true);
  }, []);

  // 處理點擊「編輯 (筆)」按鈕
  const handleEditItemClick = useCallback((item) => {
    setEditingCategory(item); // 設定要編輯的物件
    setShowModal(true);
  }, []);

  // 處理彈窗按下「確定」
  const handleModalConfirm = useCallback(async (name, amountStr) => {
    const amountNum = parseInt(amountStr, 10);
    if (!name || isNaN(amountNum) || amountNum < 0) {
      Alert.alert('提醒', '資料無效');
      return;
    }

    try {
      if (editingCategory) {
        // 如果有編輯對象，呼叫更新 API
        await budgetApi.updateCategory(editingCategory.id, {
          name,
          amount: amountNum,
        });
      } else {
        // 如果沒有，呼叫新增 API
        await budgetApi.addCategory({
          name,
          amount: amountNum,
          spent: 0,
        });
      }
      setShowModal(false);
      loadBudgetData(selectedMonth);
    } catch (e) {
      console.error('儲存失敗', e);
      Alert.alert('錯誤', '儲存失敗，請稍後再試');
    }
  }, [editingCategory, loadBudgetData, selectedMonth]);

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

      <BudgetCards
        items={currentItems}
        onAddItem={handleAddItemClick}   // 改用新的 handler
        onEditItem={handleEditItemClick} // 傳入編輯 handler
      />

      <AddCategoryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm} // 改用新的通用 handler
        editItem={editingCategory}     // 傳入要編輯的物件
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BudgetScreen;