import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CATEGORIES = {
  food: { label: '食物', color: '#FFE66D', icon: '🍔' },
  shopping: { label: '購物', color: '#4A90E2', icon: '🛍️' },
  medical: { label: '醫療', color: '#FF9A56', icon: '⚕️' },
  lifestyle: { label: '生活用品', color: '#52C77F', icon: '🛁' },
  clothing: { label: '衣服', color: '#E8E8E8', icon: '👕' },
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const BudgetItem = ({ item }) => {
  const category = CATEGORIES[item.category];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <Text style={styles.icon}>{category.icon}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.category}>{category.label}</Text>
          <Text style={styles.percentage}>{item.percentage}%</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: hexToRgba(category.color, 0.3) }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.percentage}%`,
                backgroundColor: category.color,
              },
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  icon: {
    fontSize: 24,
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 18,
    color: '#fff',
  },
  content: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
    color: '#999',
  },
  amountRow: {
    marginBottom: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default BudgetItem;


// // ============================================
// // 文件：src/features/Budget/components/BudgetItem.js
// // ============================================
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// const CATEGORIES = {
//   food: { label: '食物', color: '#FFE66D', icon: '🍔' },
//   shopping: { label: '購物', color: '#4A90E2', icon: '🛍️' },
//   medical: { label: '醫療', color: '#FF9A56', icon: '⚕️' },
//   lifestyle: { label: '生活用品', color: '#52C77F', icon: '🛁' },
//   clothing: { label: '衣服', color: '#E8E8E8', icon: '👕' }
// };

// const BudgetItem = ({ item, onEdit }) => {
//   const category = CATEGORIES[item.category];

//   // 將 hex 色碼轉換為帶透明度的 rgba
//   const hexToRgba = (hex, alpha) => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);
//     return `rgba(${r},${g},${b},${alpha})`;
//   };

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { backgroundColor: category.color }]}>
//         <Text style={styles.icon}>{category.icon}</Text>
//         <TouchableOpacity style={styles.editButton} onPress={onEdit}>
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
//                 backgroundColor: category.color
//               }
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
//     backgroundColor: '#fff'
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12
//   },
//   icon: {
//     fontSize: 24
//   },
//   editButton: {
//     padding: 8
//   },
//   editIcon: {
//     fontSize: 18,
//     color: '#fff'
//   },
//   content: {
//     backgroundColor: '#f9f9f9',
//     paddingHorizontal: 12,
//     paddingVertical: 12
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4
//   },
//   category: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500'
//   },
//   percentage: {
//     fontSize: 12,
//     color: '#999'
//   },
//   amountRow: {
//     marginBottom: 8
//   },
//   amount: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#000'
//   },
//   progressBar: {
//     height: 4,
//     borderRadius: 2,
//     overflow: 'hidden'
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 2
//   }
// });

// export default BudgetItem;