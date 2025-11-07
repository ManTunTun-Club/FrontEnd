// src/features/Budget/components/BudgetTabs.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BudgetTabs = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {/* 預算分頁 */}
      <TouchableOpacity
        style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
        onPress={() => {
          onTabChange('budget');
        }}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'budget' }}
        accessibilityLabel="預算分頁"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.tabText, activeTab === 'budget' && styles.activeTabText]}>
          預算
        </Text>
      </TouchableOpacity>

      {/* 支出分頁 */}
      <TouchableOpacity
        style={[styles.tab, activeTab === 'spending' && styles.activeTab]}
        onPress={() => {
          onTabChange('spending');
        }}
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
  },
});

export default BudgetTabs;