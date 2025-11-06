// src/features/Budget/components/BudgetCards.js

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import BudgetItem from './BudgetItem';
import AddItemButton from './AddItemButton';

// 新增 onEditItem prop
const BudgetCards = ({ items = [], onAddItem, onEditItem }) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 30 - 12) / 2;
  const CARD_HEIGHT = 120;

  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push({
      left: items[i],
      right: items[i + 1] || null,
    });
  }

  const lastRow = rows[rows.length - 1];
  const isLastRowFull = lastRow && lastRow.right !== null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {rows.map((row, idx) => (
        <View key={`row-${idx}`} style={styles.row}>
          <View style={{ width: cardWidth }}>
            {/* 傳入 onEdit={onEditItem} */}
            <BudgetItem item={row.left} height={CARD_HEIGHT} onEdit={onEditItem} />
          </View>

          <View style={{ width: cardWidth }}>
            {row.right ? (
              // 傳入 onEdit={onEditItem}
              <BudgetItem item={row.right} height={CARD_HEIGHT} onEdit={onEditItem} />
            ) : (
              (idx === rows.length - 1) && (
                <AddItemButton onPress={onAddItem} height={CARD_HEIGHT} />
              )
            )}
          </View>
        </View>
      ))}

      {(items.length === 0 || isLastRowFull) && (
        <View style={styles.row}>
          <View style={{ width: cardWidth }}>
            <AddItemButton onPress={onAddItem} height={CARD_HEIGHT} />
          </View>
          <View style={{ width: cardWidth }} />
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  bottomPadding: {
    height: 20,
  },
});

export default BudgetCards;