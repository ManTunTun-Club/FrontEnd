import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CATEGORIES = {
  food: { label: '食物', color: '#FFE66D', icon: '🍔' },
  shopping: { label: '購物', color: '#4A90E2', icon: '🛍️' },
  medical: { label: '醫療', color: '#FF9A56', icon: '⚕️' },
  lifestyle: { label: '生活用品', color: '#52C77F', icon: '🛁' },
  clothing: { label: '衣服', color: '#E8E8E8', icon: '👕' },
};

// 將 hex 轉換為 rgba
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const BudgetItem = ({ item }) => {
  const category = CATEGORIES[item.category] || {
    label: item.category,
    color: '#999',
    icon: '📋'
  };

  return (
    <View style={styles.container}>
      {/* 上方彩色區域 */}
      <View style={[styles.itemHeader, { backgroundColor: category.color }]}>
        <Text style={styles.itemIcon}>{category.icon}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* 下方資訊區域 */}
      <View style={styles.itemInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.categoryName}>{category.label}</Text>
          <Text style={styles.percentage}>{item.percentage}%</Text>
        </View>

        <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>

        {/* 喝飲料杯效果進度條 - 從下到上填充 */}
        <View style={styles.juiceContainer}>
          {/* 灰色背景（未使用部分） */}
          <View
            style={[
              styles.juiceBackground,
              { backgroundColor: hexToRgba(category.color, 0.2) }
            ]}
          />
          
          {/* 彩色液體（已使用部分） - 絕對定位在底部 */}
          <View
            style={[
              styles.juiceFill,
              {
                backgroundColor: category.color,
                height: `${item.percentage}%`,
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemIcon: {
    fontSize: 24,
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 18,
    color: '#fff',
  },
  itemInfo: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
    color: '#999',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  // 喝飲料杯效果進度條
  juiceContainer: {
    height: 100, // 增加高度讓效果明顯
    backgroundColor: '#E8E8E8', // 灰色底色
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'column-reverse', // 從下往上排列
    position: 'relative',
    marginTop: 8,
  },
  juiceBackground: {
    flex: 1,
  },
  juiceFill: {
    borderRadius: 4,
    // height 會動態設定為 percentage%
  },
});

export default BudgetItem;




// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// const CATEGORIES = {
//   food: { label: '食物', color: '#FFE66D', icon: '🍔' },
//   shopping: { label: '購物', color: '#4A90E2', icon: '🛍️' },
//   medical: { label: '醫療', color: '#FF9A56', icon: '⚕️' },
//   lifestyle: { label: '生活用品', color: '#52C77F', icon: '🛁' },
//   clothing: { label: '衣服', color: '#E8E8E8', icon: '👕' },
// };

// const hexToRgba = (hex, alpha) => {
//   const r = parseInt(hex.slice(1, 3), 16);
//   const g = parseInt(hex.slice(3, 5), 16);
//   const b = parseInt(hex.slice(5, 7), 16);
//   return `rgba(${r},${g},${b},${alpha})`;
// };

// const BudgetItem = ({ item }) => {
//   const category = CATEGORIES[item.category];

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { backgroundColor: category.color }]}>
//         <Text style={styles.icon}>{category.icon}</Text>
//         <TouchableOpacity style={styles.editButton}>
//           <Text style={styles.editIcon}>✏️</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.content}>
//         <View style={styles.infoRow}>
//           <Text style={styles.category}>{category.label}</Text>
//           <Text style={styles.percentage}>{item.percentage}%</Text>
//         </View>
//         <View style={styles.amountRow}>
//           <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
//         </View>
//         <View style={[styles.progressBar, { backgroundColor: hexToRgba(category.color, 0.3) }]}>
//           <View
//             style={[
//               styles.progressFill,
//               {
//                 width: `${item.percentage}%`,
//                 backgroundColor: category.color,
//               },
//             ]}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 16,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   icon: {
//     fontSize: 24,
//   },
//   editButton: {
//     padding: 8,
//   },
//   editIcon: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   content: {
//     backgroundColor: '#f9f9f9',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   category: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   percentage: {
//     fontSize: 12,
//     color: '#999',
//   },
//   amountRow: {
//     marginBottom: 8,
//   },
//   amount: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   progressBar: {
//     height: 4,
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 2,
//   },
// });

// export default BudgetItem;

