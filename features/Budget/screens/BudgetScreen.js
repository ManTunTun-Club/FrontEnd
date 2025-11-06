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

/**
 * 依順序指派顏色，並計算「剩餘預算百分比」
 * @param {Array} categories - 原始分類資料
 */
const assignColorsAndCalculatePercentage = (categories) =>
  categories.map((c, idx) => {
    const amount = Number(c.amount) || 0;
    const spent = Number(c.spent) || 0;
    
    // 計算剩餘百分比： ((總額 - 已花費) / 總額) * 100
    let remainingPct = 0;
    if (amount > 0) {
      remainingPct = Math.round(((amount - spent) / amount) * 100);
    }

    // 確保百分比在 0 ~ 100 之間 (避免超支時變成負數，若需顯示超支可移除此行)
    remainingPct = Math.max(0, Math.min(100, remainingPct));

    return {
      id: c.id,
      name: c.name,
      amount,
      spent,
      percentage: remainingPct, // 這裡儲存的是「剩餘百分比」
      color: BUDGET_COLORS[idx % BUDGET_COLORS.length],
    };
  });

const BudgetScreen = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [selectedMonth, setSelectedMonth] = useState('8月');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadBudgetData = useCallback(async (month) => {
    try {
      setLoading(true);
      // 1. 同時撈取月份設定與分類列表
      const [monthData, categoriesRaw] = await Promise.all([
        budgetApi.getBudgetData(month),
        budgetApi.getCategories(),
      ]);

      // 2. 計算總預算：優先使用所有分類的金額加總，確保資料一致性
      const totalFromItems = categoriesRaw.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
      const finalTotalBudget = totalFromItems || monthData?.totalBudget || 0;

      // 3. 計算每個項目的「剩餘百分比」並分配顏色
      const items = assignColorsAndCalculatePercentage(categoriesRaw);

      setData({
        totalBudget: finalTotalBudget,
        items,
      });
    } catch (e) {
      console.error('載入預算資料失敗', e);
      Alert.alert('錯誤', '載入失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  }, []);

  // 當月份改變時重新載入資料
  useEffect(() => {
    loadBudgetData(selectedMonth);
  }, [selectedMonth, loadBudgetData]);

  const currentItems = useMemo(() => data?.items || [], [data]);
  const totalBudget = data?.totalBudget ?? 0;

  // 處理新增分類
  const handleConfirmAddItem = useCallback(async (name, amountStr) => {
    const amountNum = parseInt(amountStr, 10);
    if (!name || isNaN(amountNum) || amountNum < 0) {
      Alert.alert('提醒', '請輸入有效的名稱與金額');
      return;
    }

    try {
      await budgetApi.addCategory({
        name,
        amount: amountNum,
        spent: 0, // 新分類預設已花費為 0，所以剩餘百分比會是 100%
      });
      // 成功後關閉視窗並重新載入資料
      setShowAddModal(false);
      loadBudgetData(selectedMonth);
    } catch (e) {
      console.error('新增分類失敗', e);
      Alert.alert('錯誤', '新增失敗，請稍後再試。');
    }
  }, [loadBudgetData, selectedMonth]);

  // 首次載入時的 Loading 畫面
  if (loading && !data) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 上方圓餅圖區域 */}
      <BudgetChart
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        totalBudget={totalBudget}
        items={currentItems}
      />

      {/* 中間分頁切換 */}
      <BudgetTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 下方卡片列表區域 */}
      <BudgetCards
        items={currentItems}
        onAddItem={() => setShowAddModal(true)}
      />

      {/* 新增分類彈窗 */}
      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleConfirmAddItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BudgetScreen;