import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import BudgetItem from './BudgetItem';
import AddItemButton from './AddItemButton';

const BudgetCards = ({ items, onAddItem }) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 50) / 2;

  const organizedData = [];
  for (let i = 0; i < items.length; i += 2) {
    organizedData.push({
      left: items[i],
      right: items[i + 1] || null
    });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {organizedData.map((row, index) => (
        <View key={index} style={styles.row}>
          <View style={[styles.column, { width: cardWidth }]}>
            {row.left && <BudgetItem item={row.left} />}
          </View>
          <View style={[styles.column, { width: cardWidth }]}>
            {row.right && <BudgetItem item={row.right} />}
            {index === organizedData.length - 1 && !row.right && (
              <AddItemButton onPress={onAddItem} />
            )}
          </View>
        </View>
      ))}
      {items.length === 0 && (
        <View style={styles.row}>
          <View style={[styles.column, { width: cardWidth }]}>
            <AddItemButton onPress={onAddItem} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  column: {
    flex: 1
  }
});

export default BudgetCards;

// // ============================================
// // 文件：src/features/Budget/components/BudgetCards.js
// // ============================================
// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   ScrollView
// } from 'react-native';
// import BudgetItem from './BudgetItem';

// const BudgetCards = ({ items }) => {
//   const { width } = Dimensions.get('window');
//   const cardWidth = (width - 50) / 2;

//   // 重新排列資料為兩列
//   const organizedData = [];
//   for (let i = 0; i < items.length; i += 2) {
//     organizedData.push({
//       left: items[i],
//       right: items[i + 1] || null
//     });
//   }

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {organizedData.map((row, index) => (
//         <View key={index} style={styles.row}>
//           <View style={[styles.column, { width: cardWidth }]}>
//             {row.left && <BudgetItem item={row.left} />}
//           </View>
//           <View style={[styles.column, { width: cardWidth }]}>
//             {row.right && <BudgetItem item={row.right} />}
//           </View>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     backgroundColor: '#fff'
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8
//   },
//   column: {
//     flex: 1
//   }
// });

// export default BudgetCards;