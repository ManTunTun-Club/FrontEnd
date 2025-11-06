import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '../../../theme/theme-color';

// 分類資訊
const CATEGORIES = {
  food: { label: '食物', color: COLORS.categoryFood, icon: '🍔' },
  shopping: { label: '購物', color: COLORS.categoryShopping, icon: '🛍️' },
  medical: { label: '醫療', color: COLORS.categoryMedical, icon: '⚕️' },
  lifestyle: { label: '生活用品', color: COLORS.categoryLifestyle, icon: '🛁' },
  clothing: { label: '衣服', color: COLORS.categoryClothing, icon: '👕' },
};

// 將 hex 轉換為 rgba
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

// 單個卡片元件
const BudgetItemCard = ({ item }) => {
  const category = CATEGORIES[item.category] || {
    label: item.category,
    color: '#999999',
    icon: '📋'
  };

  const cardHeight = 120;
  const juiceHeight = (item.percentage / 100) * cardHeight;

  const handleViewBudget = () => {
    // TODO: 導航到預算規劃詳細頁面
    console.log('查看預算規劃:', item.category);
  };

  const handleEditBudget = () => {
    // TODO: 打開編輯彈窗
    console.log('編輯預算:', item.category);
  };

  return (
    <View style={[styles.itemCard, { height: cardHeight }]}>
      {/* 背景層：果汁 */}
      <View
        style={[
          styles.juiceBackground,
          { backgroundColor: hexToRgba(category.color, 0.15) }
        ]}
      >
        {/* 果汁填充層 */}
        <View
          style={[
            styles.juiceFill,
            {
              height: juiceHeight,
              backgroundColor: category.color,
            }
          ]}
        />
      </View>

      {/* 內容層 */}
      <View style={styles.contentLayer}>
        {/* 上半部：資訊區 */}
        <View style={styles.infoSection}>
          <View style={styles.leftInfo}>
            <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
            <Text style={styles.categoryName}>{category.label}</Text>
          </View>
          <Text style={styles.percentage}>{item.percentage}%</Text>
        </View>

        {/* 下半部：按鈕區 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.viewButton} onPress={handleViewBudget}>
            <Image
              source={require('../../../assets/icons/eye.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={handleEditBudget}>
            <Image
              source={require('../../../assets/icons/edit.png')}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// 新增按鈕
const AddButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.addButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.addButtonText}>+</Text>
      <Text style={styles.addButtonLabel}>新增類別</Text>
    </TouchableOpacity>
  );
};

// 主容器
const BudgetCards = ({ items, onAddItem }) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 50) / 2;

  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push({
      left: items[i],
      right: items[i + 1] || null,
      key: i,
    });
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
    >
      {rows.length > 0 ? (
        rows.map((row, idx) => (
          <View key={row.key} style={styles.row}>
            <View style={[styles.column, { width: cardWidth }]}>
              {row.left && <BudgetItemCard item={row.left} />}
            </View>
            <View style={[styles.column, { width: cardWidth }]}>
              {row.right && <BudgetItemCard item={row.right} />}
              {idx === rows.length - 1 && !row.right && (
                <AddButton onPress={onAddItem} />
              )}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.row}>
          <View style={[styles.column, { width: cardWidth }]}>
            <AddButton onPress={onAddItem} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  column: {
    flex: 1,
  },

  itemCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
  },

  juiceBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },

  juiceFill: {
    width: '100%',
  },

  contentLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    justifyContent: 'space-between',
    zIndex: 10,
    flexDirection: 'column',
  },

  // 上半部：資訊區
  infoSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginTop: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  // 下半部：按鈕區
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 0,
    paddingHorizontal: 0,
  },
  viewButton: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  editButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '500',
  },

  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    paddingVertical: 20,
  },
  addButtonText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#bbb',
    marginBottom: 8,
  },
  addButtonLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
});

export default BudgetCards;