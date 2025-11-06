import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import budgetData from '../data/budgetData.json';

const MONTHS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

const BudgetChart = ({ selectedMonth, onMonthChange, totalBudget, chartData = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const chartSize = 280;
  const arcRadius = 110;

  // 從 JSON 取得該月的圖表資料
  const chartDataFromJson = chartData && chartData.length > 0 ? chartData : [
    { category: 'lifestyle', label: '生活用品', color: '#52C77F', remaining: 90, icon: '🛁' },
  ];

  // 生成圓弧段 - 喝飲料杯效果
  let currentAngle = 0;
  const arcSegments = [];
  const percentageLabels = [];

  chartDataFromJson.forEach((item, index) => {
    const segmentAngle = (item.remaining / 100) * 360; // 根據剩餘百分比計算角度
    const endAngle = currentAngle + segmentAngle;
    const midAngle = currentAngle + segmentAngle / 2;

    // 顏色圓弧段
    const colorArc = {
      startAngle: currentAngle,
      endAngle: endAngle,
      color: item.color,
      key: `color-${index}`
    };

    // 灰色圓弧段（剩餘部分）
    const grayArc = {
      startAngle: endAngle,
      endAngle: currentAngle + 360,
      color: '#E8E8E8',
      key: `gray-${index}`
    };

    arcSegments.push(colorArc);
    if (item.remaining < 100) {
      arcSegments.push(grayArc);
    }

    // 百分比標籤
    const rad = (midAngle * Math.PI) / 180;
    const labelRadius = arcRadius + 50;
    const x = labelRadius * Math.cos(rad - Math.PI / 2);
    const y = labelRadius * Math.sin(rad - Math.PI / 2);

    percentageLabels.push(
      <View
        key={`label-${index}`}
        style={[
          styles.percentageLabel,
          {
            transform: [{ translateX: x }, { translateY: y }],
          },
        ]}
      >
        <Text style={styles.percentageText}>{item.remaining}%</Text>
      </View>
    );

    currentAngle = currentAngle + 360;
  });

  // 繪製圓弧的函數
  const ArcSegment = ({ startAngle, endAngle, color }) => {
    const radius = arcRadius;
    const strokeWidth = 28;

    // 計算圓弧的起點和終點座標
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius * Math.cos(startRad - Math.PI / 2);
    const y1 = radius * Math.sin(startRad - Math.PI / 2);
    const x2 = radius * Math.cos(endRad - Math.PI / 2);
    const y2 = radius * Math.sin(endRad - Math.PI / 2);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    // 使用 SVG-like 的弧線，通過 borderRadius 和 transform 近似實現
    const angle = startAngle;

    return (
      <View
        key={`${startAngle}-${endAngle}`}
        style={[
          styles.arcSegment,
          {
            backgroundColor: color,
            transform: [
              { rotate: `${angle}deg` },
              { translateY: -radius },
            ],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <View style={styles.chartCircle}>
          {/* 繪製所有圓弧段 */}
          {arcSegments.map((arc, idx) => (
            <ArcSegment
              key={`${arc.key}-${idx}`}
              startAngle={arc.startAngle}
              endAngle={arc.endAngle}
              color={arc.color}
            />
          ))}
          {/* 百分比標籤 */}
          {percentageLabels}
        </View>

        {/* 中央內容 */}
        <View style={styles.centerContent}>
          <Text style={styles.centerLabel}>預算額度</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.monthSelector}>
              <Text style={styles.month}>{selectedMonth}</Text>
              <Text style={styles.dropdown}>▼</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.amount}>${totalBudget.toLocaleString()}</Text>
        </View>
      </View>

      {/* 月份選擇 Modal */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={MONTHS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.monthOption,
                    selectedMonth === item && styles.monthOptionSelected,
                  ]}
                  onPress={() => {
                    onMonthChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      selectedMonth === item && styles.monthOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={4}
              scrollEnabled
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chartCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  arcSegment: {
    position: 'absolute',
    width: 280,
    height: 140,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
  },
  percentageLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  centerLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  month: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
    color: '#333',
  },
  dropdown: {
    fontSize: 12,
    color: '#333',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  monthOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  monthOptionSelected: {
    backgroundColor: '#4A90E2',
  },
  monthOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  monthOptionTextSelected: {
    color: '#fff',
  },
});

export default BudgetChart;






// // src/features/Budget/components/BudgetChart.js

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   FlatList,
// } from 'react-native';

// const MONTHS = [
//   '1月', '2月', '3月', '4月', '5月', '6月',
//   '7月', '8月', '9月', '10月', '11月', '12月'
// ];

// const BudgetChart = ({ selectedMonth, onMonthChange, totalBudget }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const chartSize = 280;
//   const radius = 110;

//   const chartData = [
//     { percentage: 29, color: '#52C77F' },
//     { percentage: 20, color: '#FF9A56' },
//     { percentage: 36, color: '#4A90E2' },
//     { percentage: 15, color: '#FFE66D' }
//   ];

//   let currentAngle = 0;
//   const arcs = [];
//   const labels = [];

//   chartData.forEach((item, index) => {
//     const endAngle = currentAngle + item.percentage * 3.6;
//     const midAngle = currentAngle + (endAngle - currentAngle) / 2;

//     // 使用 View 和 border-radius 繪製圓弧段
//     const rotation = (currentAngle + (endAngle - currentAngle) / 2) - 90;
    
//     arcs.push(
//       <View
//         key={`arc-${index}`}
//         style={[
//           styles.arcSegment,
//           {
//             backgroundColor: item.color,
//             transform: [{ rotate: `${rotation}deg` }],
//             opacity: 0.9,
//           }
//         ]}
//       />
//     );

//     // 百分比標籤位置
//     const radius = 130;
//     const rad = midAngle * (Math.PI / 180);
//     const x = radius * Math.cos(rad);
//     const y = radius * Math.sin(rad);

//     labels.push(
//       <View
//         key={`label-${index}`}
//         style={[
//           styles.percentageLabel,
//           {
//             transform: [
//               { translateX: x },
//               { translateY: y }
//             ]
//           }
//         ]}
//       >
//         <Text style={styles.percentageText}>{item.percentage}%</Text>
//       </View>
//     );

//     currentAngle = endAngle;
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.chartWrapper}>
//         <View style={styles.chartCircle}>
//           {arcs.map((arc, idx) => (
//             <View key={`arc-container-${idx}`} style={styles.arcContainer}>
//               {arc}
//             </View>
//           ))}
//           {labels}
//         </View>
//         <View style={styles.centerContent}>
//           <Text style={styles.centerLabel}>預算額度</Text>
//           <TouchableOpacity onPress={() => setModalVisible(true)}>
//             <View style={styles.monthSelector}>
//               <Text style={styles.month}>{selectedMonth}</Text>
//               <Text style={styles.dropdown}>▼</Text>
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.amount}>${totalBudget.toLocaleString()}</Text>
//         </View>
//       </View>

//       <Modal
//         transparent
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//         animationType="fade"
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           onPress={() => setModalVisible(false)}
//           activeOpacity={1}
//         >
//           <View style={styles.modalContent}>
//             <FlatList
//               data={MONTHS}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={[
//                     styles.monthOption,
//                     selectedMonth === item && styles.monthOptionSelected
//                   ]}
//                   onPress={() => {
//                     onMonthChange(item);
//                     setModalVisible(false);
//                   }}
//                 >
//                   <Text
//                     style={[
//                       styles.monthOptionText,
//                       selectedMonth === item && styles.monthOptionTextSelected
//                     ]}
//                   >
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               numColumns={4}
//               scrollEnabled
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     paddingVertical: 30,
//     backgroundColor: '#fff',
//   },
//   chartWrapper: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   chartCircle: {
//     width: 280,
//     height: 280,
//     borderRadius: 140,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   arcContainer: {
//     position: 'absolute',
//     width: 280,
//     height: 280,
//     borderRadius: 140,
//   },
//   arcSegment: {
//     position: 'absolute',
//     width: 280,
//     height: 140,
//     borderTopLeftRadius: 140,
//     borderTopRightRadius: 140,
//   },
//   percentageLabel: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   percentageText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   centerContent: {
//     position: 'absolute',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   centerLabel: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 8,
//   },
//   monthSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   month: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 4,
//     color: '#333',
//   },
//   dropdown: {
//     fontSize: 12,
//     color: '#333',
//   },
//   amount: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     width: '80%',
//     maxHeight: '60%',
//   },
//   monthOption: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     alignItems: 'center',
//     margin: 4,
//     borderRadius: 8,
//     backgroundColor: '#f5f5f5',
//   },
//   monthOptionSelected: {
//     backgroundColor: '#4A90E2',
//   },
//   monthOptionText: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
//   monthOptionTextSelected: {
//     color: '#fff',
//   },
// });

// export default BudgetChart;

