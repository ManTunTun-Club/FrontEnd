// src/features/Budget/screens/BudgetScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import BudgetChart from '../components/BudgetChart';
import BudgetTabs from '../components/BudgetTabs';
import BudgetCards from '../components/BudgetCards';
import AddCategoryModal from '../components/AddCategoryModal';
import { budgetApi } from '../../../services/budgetApi';

const BudgetScreen = () => {
  const [activeTab, setActiveTab] = useState('budget'); // 'budget' | 'spending'
  const [selectedMonth, setSelectedMonth] = useState('8月');

  // 預算資料
  const [data, setData] = useState(null);
  const [loadingBudget, setLoadingBudget] = useState(false);

  // 支出資料（已購買）
  const [expenses, setExpenses] = useState([]);
  const [loadingExpense, setLoadingExpense] = useState(false);

  // 新增/編輯 modal
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // { id, name, amount, spent, ... }

  const loadBudgetData = useCallback(async (month) => {
    try {
      setLoadingBudget(true);
      const [monthData, categories] = await Promise.all([
        budgetApi.getBudgetData(month),
        budgetApi.getCategories(month),
      ]);
      setData({ totalBudget: monthData?.totalBudget ?? 0, items: categories || [] });
    } catch (e) {
      console.error('載入預算失敗', e);
      Alert.alert('錯誤', '載入預算失敗');
    } finally {
      setLoadingBudget(false);
    }
  }, []);

  const loadExpenses = useCallback(async (month) => {
    try {
      setLoadingExpense(true);
      const res = await budgetApi.getExpenses({ month, status: 'purchased' });
      setExpenses(res.items || []);
    } catch (e) {
      console.error('載入支出失敗', e);
      Alert.alert('錯誤', '載入支出失敗');
    } finally {
      setLoadingExpense(false);
    }
  }, []);

  // 月份變更 → 重新載入兩邊資料
  useEffect(() => {
    loadBudgetData(selectedMonth);
    if (activeTab === 'spending') {
      loadExpenses(selectedMonth);
    }
  }, [selectedMonth, activeTab, loadBudgetData, loadExpenses]);

  const currentItems = useMemo(() => data?.items || [], [data]);
  const totalBudget = data?.totalBudget ?? 0;

  // 點新增
  const handleAddItemClick = useCallback(() => {
    setEditingCategory(null);
    setShowModal(true);
  }, []);

  // 點編輯
  const handleEditItemClick = useCallback((item) => {
    setEditingCategory(item); // {id, name, amount, spent, ...}
    setShowModal(true);
  }, []);

  // 新增/編輯 確認（含防呆）
  const handleModalConfirm = useCallback(
    async (name, amountStr) => {
      // 金額清洗
      const cleaned = String(amountStr ?? '')
        .replace(/[,，\s]/g, '')
        .replace(/[^\d.-]/g, '');
      const amountNum = Number(cleaned);

      if (!name || isNaN(amountNum) || amountNum < 0) {
        Alert.alert('提醒', '資料無效');
        return;
      }

      try {
        if (editingCategory) {
          // 🔒 防呆檢查：新預算不得低於已花費金額
          const currentSpent = Number(editingCategory.spent || 0);
          if (amountNum < currentSpent) {
            Alert.alert(
              '提醒',
              `此類別已花費 ${currentSpent.toLocaleString()} 元，預算金額不能低於已花費金額。`
            );
            return; // 中斷更新
          }

          await budgetApi.updateCategoryAmount(selectedMonth, editingCategory.id, amountNum);
        } else {
          // 新增類別：以名稱對 catalog 找到 categoryId，再新增到該月
          const all = await budgetApi._debug_getAll?.();
          const catalog = all?.catalog || [];
          const found = catalog.find((c) => c.name === name);
          if (!found) {
            Alert.alert('提醒', `找不到類別「${name}」，請改用已存在的分類名稱。`);
            return;
          }
          await budgetApi.addCategoryToMonth(selectedMonth, {
            categoryId: found.id,
            amount: amountNum,
          });
        }

        setShowModal(false);
        loadBudgetData(selectedMonth);
        if (activeTab === 'spending') {
          loadExpenses(selectedMonth);
        }
      } catch (e) {
        console.error('儲存失敗', e);
        Alert.alert('錯誤', '儲存失敗，請稍後再試');
      }
    },
    [editingCategory, selectedMonth, activeTab, loadBudgetData, loadExpenses]
  );

  // 切到「支出」時即時載入
  useEffect(() => {
    if (activeTab === 'spending') {
      loadExpenses(selectedMonth);
    }
  }, [activeTab, selectedMonth, loadExpenses]);

  if (loadingBudget && !data) {
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

      {activeTab === 'budget' ? (
        <BudgetCards
          month={selectedMonth}              // 傳遞月份，供類別詳情頁使用
          items={currentItems}
          onAddItem={handleAddItemClick}
          onEditItem={handleEditItemClick}
        />
      ) : (
        <View style={styles.spendingWrap}>
          {loadingExpense ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : (
            <FlatList
              data={expenses}
              keyExtractor={(it) => String(it.id)}
              contentContainerStyle={expenses.length ? styles.expList : styles.expEmptyWrap}
              renderItem={({ item }) => (
                <View style={styles.expRow}>
                  <View style={styles.expLeft}>
                    <Text style={styles.expTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.expMeta}>
                      {item.source} · {item.paymentMethod}
                    </Text>
                  </View>
                  <View style={styles.expRight}>
                    <Text style={styles.expPrice}>
                      {`$${Number(item.price || 0).toLocaleString()}`}
                    </Text>
                    <Text style={styles.expDate}>{item.date}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.expEmpty}>本月尚無已購買紀錄</Text>}
            />
          )}
        </View>
      )}

      <AddCategoryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
        editItem={editingCategory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // 支出列表樣式
  spendingWrap: { flex: 1, padding: 16 },
  expList: { paddingBottom: 24 },
  expEmptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  expRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  expLeft: { flex: 1, paddingRight: 8 },
  expTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  expMeta: { marginTop: 4, color: '#6B7280', fontSize: 13 },
  expRight: { alignItems: 'flex-end' },
  expPrice: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  expDate: { marginTop: 4, color: '#9CA3AF', fontSize: 12 },
});

export default BudgetScreen;
