// src/features/Budget/components/BudgetTabs.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * BudgetTabs
 * - 兩個分頁切換：「預算」、「支出」
 * - 由父層控制 activeTab（'budget' | 'spending'）
 * - onTabChange 由父層傳入，切換時呼叫
 */
const BudgetTabs = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {/* 預算分頁 */}
      <TouchableOpacity
        // 基本樣式 + 依選中狀態套用底線色
        style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
        onPress={() => onTabChange('budget')}
        // 互動回饋（按下時透明）
        activeOpacity={0.7}
        // 無障礙：告訴讀屏這是分頁按鈕，且是否已選中
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'budget' }}
        accessibilityLabel="預算分頁"
        // 擴大可點擊區域，提升易用性（不影響視覺大小）
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.tabText, activeTab === 'budget' && styles.activeTabText]}>
          預算
        </Text>
      </TouchableOpacity>

      {/* 支出分頁 */}
      <TouchableOpacity
        style={[styles.tab, activeTab === 'spending' && styles.activeTab]}
        onPress={() => onTabChange('spending')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'spending' }}
        accessibilityLabel="支出分頁"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.tabText, activeTab === 'spending' && styles.activeTabText]}>
          支出
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  /** 外層容器：水平排列兩個分頁 */
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  /** 單一分頁的可點擊區 */
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  /** 被選中的分頁：用較粗的底線強調 */
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2',
  },
  /** 分頁文字（一般狀態） */
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  /** 分頁文字（選中狀態） */
  activeTabText: {
    color: '#000',
  },
});

export default BudgetTabs;
