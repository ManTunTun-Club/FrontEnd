import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import BudgetChart from '../components/BudgetChart';
import BudgetTabs from '../components/BudgetTabs';
import BudgetCards from '../components/BudgetCards';
import { budgetApi } from '../../../services/budgetApi';

const CATEGORIES = {
  food: { label: '食物', color: '#FFE66D', icon: '🍔' },
  shopping: { label: '購物', color: '#4A90E2', icon: '🛍️' },
  medical: { label: '醫療', color: '#FF9A56', icon: '⚕️' },
  lifestyle: { label: '生活用品', color: '#52C77F', icon: '🛁' },
  clothing: { label: '衣服', color: '#E8E8E8', icon: '👕' },
};

const BudgetScreen = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [selectedMonth, setSelectedMonth] = useState('8月');
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  // 初始化：載入某月的預算資料
  useEffect(() => {
    loadBudgetData(selectedMonth);
  }, [selectedMonth]);

  const loadBudgetData = async (month) => {
    try {
      setLoading(true);
      const data = await budgetApi.getBudgetData(month);
      setBudgetData(data);
    } catch (error) {
      console.error('載入預算資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取得當前頁簽的項目
  const currentItems = budgetData ? budgetData[activeTab] : [];
  const totalBudget = budgetData ? budgetData.totalBudget : 20000;

  const handleAddItem = () => {
    setShowAddModal(true);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleConfirmAddItem = async () => {
    if (!newItemName.trim() || !newItemAmount.trim()) {
      alert('請填入類別名稱和預算金額');
      return;
    }

    try {
      const categoryKey = newItemName.toLowerCase();

      const newItem = {
        category: categoryKey,
        amount: parseInt(newItemAmount),
        percentage: 0
      };

      await budgetApi.addItem(selectedMonth, activeTab, newItem);

      // 重新載入資料
      await loadBudgetData(selectedMonth);

      setShowAddModal(false);
      setNewItemName('');
      setNewItemAmount('');
    } catch (error) {
      console.error('新增項目失敗:', error);
      alert('新增項目失敗');
    }
  };

  if (loading && !budgetData) {
    return (
      <SafeAreaView style={styles.container}>
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
        chartData={budgetData?.chartData || []}
      />
      <BudgetTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {currentItems && currentItems.length > 0 ? (
        <BudgetCards items={currentItems} onAddItem={handleAddItem} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暫無資料</Text>
        </View>
      )}

      {/* 新增項目彈窗 */}
      <Modal
        transparent
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.addModalOverlay}
          onPress={() => setShowAddModal(false)}
          activeOpacity={1}
        >
          <View style={styles.addModalContent}>
            <Text style={styles.addModalTitle}>新增類別</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>類別名稱</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入類別名稱"
                placeholderTextColor="#ccc"
                value={newItemName}
                onChangeText={setNewItemName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>預算金額</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入預算金額"
                placeholderTextColor="#ccc"
                value={newItemAmount}
                onChangeText={setNewItemAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmAddItem}
              >
                <Text style={styles.confirmButtonText}>確定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
  },
  addModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BudgetScreen;


// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   SafeAreaView,
//   Modal,
//   TouchableOpacity,
//   Text,
//   TextInput,
// } from 'react-native';
// import BudgetChart from '../components/BudgetChart';
// import BudgetTabs from '../components/BudgetTabs';
// import BudgetCards from '../components/BudgetCards';

// const INITIAL_BUDGET_DATA = {
//   '8月': {
//     budget: [
//       { id: 1, category: 'food', amount: 7200, percentage: 40 },
//       { id: 2, category: 'medical', amount: 4000, percentage: 12 }
//     ],
//     spending: [
//       { id: 3, category: 'lifestyle', amount: 5800, percentage: 90 },
//       { id: 4, category: 'clothing', amount: 3000, percentage: 0 }
//     ]
//   }
// };

// const CATEGORIES = {
//   food: { label: '食物', color: '#FFE66D', icon: '🍔' },
//   shopping: { label: '購物', color: '#4A90E2', icon: '🛍️' },
//   medical: { label: '醫療', color: '#FF9A56', icon: '⚕️' },
//   lifestyle: { label: '生活用品', color: '#52C77F', icon: '🛁' },
//   clothing: { label: '衣服', color: '#E8E8E8', icon: '👕' },
// };

// const BudgetScreen = () => {
//   const [activeTab, setActiveTab] = useState('budget');
//   const [selectedMonth, setSelectedMonth] = useState('8月');
//   const [budgetItems, setBudgetItems] = useState(INITIAL_BUDGET_DATA);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newItemName, setNewItemName] = useState('');
//   const [newItemAmount, setNewItemAmount] = useState('');

//   const currentBudgetData = budgetItems[selectedMonth] || budgetItems['8月'];
//   const currentItems = currentBudgetData[activeTab];

//   const handleAddItem = () => {
//     setShowAddModal(true);
//     setNewItemName('');
//     setNewItemAmount('');
//   };

//   const handleConfirmAddItem = () => {
//     if (newItemName.trim() && newItemAmount.trim()) {
//       const categoryKey = newItemName.toLowerCase();
      
//       // 新增類別（如果不存在）
//       if (!CATEGORIES[categoryKey]) {
//         CATEGORIES[categoryKey] = {
//           label: newItemName,
//           color: '#' + Math.floor(Math.random()*16777215).toString(16),
//           icon: '📋'
//         };
//       }

//       const newItem = {
//         id: Date.now(),
//         category: categoryKey,
//         amount: parseInt(newItemAmount),
//         percentage: 0
//       };

//       // 更新預算資料
//       const updatedBudgetItems = { ...budgetItems };
//       updatedBudgetItems[selectedMonth] = {
//         ...updatedBudgetItems[selectedMonth],
//         [activeTab]: [...currentItems, newItem]
//       };
//       setBudgetItems(updatedBudgetItems);

//       setShowAddModal(false);
//       setNewItemName('');
//       setNewItemAmount('');
//     } else {
//       alert('請填入類別名稱和預算金額');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <BudgetChart
//         selectedMonth={selectedMonth}
//         onMonthChange={setSelectedMonth}
//         totalBudget={20000}
//       />
//       <BudgetTabs activeTab={activeTab} onTabChange={setActiveTab} />
//       {currentItems && currentItems.length > 0 && (
//         <BudgetCards items={currentItems} onAddItem={handleAddItem} />
//       )}

//       {/* 新增項目彈窗 */}
//       <Modal
//         transparent
//         visible={showAddModal}
//         onRequestClose={() => setShowAddModal(false)}
//         animationType="fade"
//       >
//         <TouchableOpacity
//           style={styles.addModalOverlay}
//           onPress={() => setShowAddModal(false)}
//           activeOpacity={1}
//         >
//           <View style={styles.addModalContent}>
//             <Text style={styles.addModalTitle}>新增類別</Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>類別名稱</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="輸入類別名稱"
//                 placeholderTextColor="#ccc"
//                 value={newItemName}
//                 onChangeText={setNewItemName}
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>預算金額</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="輸入預算金額"
//                 placeholderTextColor="#ccc"
//                 value={newItemAmount}
//                 onChangeText={setNewItemAmount}
//                 keyboardType="decimal-pad"
//               />
//             </View>

//             <View style={styles.modalButtonsContainer}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setShowAddModal(false)}
//               >
//                 <Text style={styles.cancelButtonText}>取消</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.confirmButton]}
//                 onPress={handleConfirmAddItem}
//               >
//                 <Text style={styles.confirmButtonText}>確定</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   addModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addModalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 24,
//     width: '85%',
//   },
//   addModalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: '#000',
//   },
//   modalButtonsContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#f0f0f0',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   confirmButton: {
//     backgroundColor: '#4A90E2',
//   },
//   cancelButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//   },
//   confirmButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//   },
// });

// export default BudgetScreen;



