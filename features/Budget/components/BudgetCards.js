import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
// 引入外部合作元件
import BudgetItem from './BudgetItem';
import AddItemButton from './AddItemButton';

const BudgetCards = ({ items = [], onAddItem }) => {
  const { width } = Dimensions.get('window');
  // 計算兩欄的寬度 (減去 padding 和中間 gap)
  const cardWidth = (width - 30 - 12) / 2;
  const CARD_HEIGHT = 120;

  // 將資料轉換為兩兩一組的 rows
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push({
      left: items[i],
      right: items[i + 1] || null,
    });
  }

  // 判斷是否需要額外一行來放「新增按鈕」
  // 如果原本最後一行是滿的(兩個都有)，新增按鈕就要在新的一行
  // 如果最後一行只有左邊有，新增按鈕就放在右邊
  const lastRow = rows[rows.length - 1];
  const isLastRowFull = lastRow && lastRow.right !== null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {rows.map((row, idx) => (
        <View key={`row-${idx}`} style={styles.row}>
          {/* 左欄 */}
          <View style={{ width: cardWidth }}>
            <BudgetItem item={row.left} height={CARD_HEIGHT} />
          </View>

          {/* 右欄：可能是卡片，也可能是新增按鈕(如果剛好是最後一個位置) */}
          <View style={{ width: cardWidth }}>
            {row.right ? (
              <BudgetItem item={row.right} height={CARD_HEIGHT} />
            ) : (
              // 如果這是最後一行且右邊是空的，就在這裡放新增按鈕
              (idx === rows.length - 1) && (
                <AddItemButton onPress={onAddItem} height={CARD_HEIGHT} />
              )
            )}
          </View>
        </View>
      ))}

      {/* 如果資料是空的，或最後一行是滿的，需要額外開一行放新增按鈕 */}
      {(items.length === 0 || isLastRowFull) && (
        <View style={styles.row}>
          <View style={{ width: cardWidth }}>
            <AddItemButton onPress={onAddItem} height={CARD_HEIGHT} />
          </View>
          {/* 右邊留白 */}
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
    gap: 12, // 如果舊版 RN 不支援 gap，請改用 marginHorizontal 控制
  },
  bottomPadding: {
    height: 20,
  },
});

export default BudgetCards;