// src/features/Budget/components/BudgetChart.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

const MONTHS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

const BudgetChart = ({ selectedMonth, onMonthChange, totalBudget }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const chartSize = 280;
  const radius = 110;

  const chartData = [
    { percentage: 29, color: '#52C77F' },
    { percentage: 20, color: '#FF9A56' },
    { percentage: 36, color: '#4A90E2' },
    { percentage: 15, color: '#FFE66D' }
  ];

  let currentAngle = 0;
  const arcs = [];
  const labels = [];

  chartData.forEach((item, index) => {
    const endAngle = currentAngle + item.percentage * 3.6;
    const midAngle = currentAngle + (endAngle - currentAngle) / 2;

    // 使用 View 和 border-radius 繪製圓弧段
    const rotation = (currentAngle + (endAngle - currentAngle) / 2) - 90;
    
    arcs.push(
      <View
        key={`arc-${index}`}
        style={[
          styles.arcSegment,
          {
            backgroundColor: item.color,
            transform: [{ rotate: `${rotation}deg` }],
            opacity: 0.9,
          }
        ]}
      />
    );

    // 百分比標籤位置
    const radius = 130;
    const rad = midAngle * (Math.PI / 180);
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);

    labels.push(
      <View
        key={`label-${index}`}
        style={[
          styles.percentageLabel,
          {
            transform: [
              { translateX: x },
              { translateY: y }
            ]
          }
        ]}
      >
        <Text style={styles.percentageText}>{item.percentage}%</Text>
      </View>
    );

    currentAngle = endAngle;
  });

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <View style={styles.chartCircle}>
          {arcs.map((arc, idx) => (
            <View key={`arc-container-${idx}`} style={styles.arcContainer}>
              {arc}
            </View>
          ))}
          {labels}
        </View>
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
                    selectedMonth === item && styles.monthOptionSelected
                  ]}
                  onPress={() => {
                    onMonthChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      selectedMonth === item && styles.monthOptionTextSelected
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
  },
  arcContainer: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
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







// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   FlatList,
// } from 'react-native';
// import Svg, { Circle, Text as SvgText } from 'react-native-svg';

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
//     const midAngle = currentAngle + (endAngle - currentAngle) / 2 - 90;

//     const circumference = 2 * Math.PI * radius;
//     const strokeDasharray = (item.percentage / 100) * circumference;

//     arcs.push(
//       <Circle
//         key={`arc-${index}`}
//         cx={chartSize / 2}
//         cy={chartSize / 2}
//         r={radius}
//         stroke={item.color}
//         strokeWidth={28}
//         fill="none"
//         strokeDasharray={strokeDasharray}
//         strokeDashoffset={0}
//         strokeLinecap="round"
//         transform={`rotate(${currentAngle} ${chartSize / 2} ${chartSize / 2})`}
//       />
//     );

//     const rad = midAngle * (Math.PI / 180);
//     const x = chartSize / 2 + (radius + 50) * Math.cos(rad);
//     const y = chartSize / 2 + (radius + 50) * Math.sin(rad);

//     labels.push(
//       <SvgText
//         key={`label-${index}`}
//         x={x}
//         y={y}
//         fontSize="14"
//         fontWeight="bold"
//         textAnchor="middle"
//         fill="#333"
//       >
//         {item.percentage}%
//       </SvgText>
//     );

//     currentAngle = endAngle;
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.chartWrapper}>
//         <Svg width={chartSize} height={chartSize}>
//           {arcs}
//           {labels}
//         </Svg>
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








// // // ============================================
// // // 文件：src/features/Budget/components/BudgetChart.js
// // // ============================================
// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Modal,
// //   FlatList,
// //   Dimensions
// // } from 'react-native';
// // import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// // const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

// // const CHART_DATA = {
// //   '8月': [
// //     { percentage: 29, color: '#52C77F' },
// //     { percentage: 20, color: '#FF9A56' },
// //     { percentage: 36, color: '#4A90E2' },
// //     { percentage: 15, color: '#FFE66D' }
// //   ]
// // };

// // const BudgetChart = ({ selectedMonth, onMonthChange, totalBudget }) => {
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const chartSize = 280;
// //   const radius = 110;
// //   const strokeWidth = 28;

// //   const chartData = CHART_DATA[selectedMonth];

// //   // 計算每段圓弧的角度範圍和位置
// //   const getArcPath = (startAngle, endAngle) => {
// //     const startRad = (startAngle - 90) * (Math.PI / 180);
// //     const endRad = (endAngle - 90) * (Math.PI / 180);

// //     const x1 = chartSize / 2 + radius * Math.cos(startRad);
// //     const y1 = chartSize / 2 + radius * Math.sin(startRad);
// //     const x2 = chartSize / 2 + radius * Math.cos(endRad);
// //     const y2 = chartSize / 2 + radius * Math.sin(endRad);

// //     const largeArc = endAngle - startAngle > 180 ? 1 : 0;

// //     return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
// //   };

// //   const getLabelPosition = (angle) => {
// //     const rad = angle * (Math.PI / 180);
// //     const x = chartSize / 2 + (radius + 50) * Math.cos(rad);
// //     const y = chartSize / 2 + (radius + 50) * Math.sin(rad);
// //     return { x, y };
// //   };

// //   // 渲染圓弧和標籤
// //   let currentAngle = 0;
// //   const arcs = [];
// //   const labels = [];

// //   chartData.forEach((item, index) => {
// //     const endAngle = currentAngle + item.percentage * 3.6;
// //     const midAngle = currentAngle + (endAngle - currentAngle) / 2 - 90;
// //     const labelPos = getLabelPosition(midAngle);

// //     arcs.push(
// //       <Circle
// //         key={`arc-${index}`}
// //         cx={chartSize / 2}
// //         cy={chartSize / 2}
// //         r={radius}
// //         stroke={item.color}
// //         strokeWidth={strokeWidth}
// //         fill="none"
// //         strokeDasharray={`${(item.percentage / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
// //         strokeDashoffset={0}
// //         strokeLinecap="round"
// //         transform={`rotate(${currentAngle} ${chartSize / 2} ${chartSize / 2})`}
// //       />
// //     );

// //     labels.push(
// //       <SvgText
// //         key={`label-${index}`}
// //         x={labelPos.x}
// //         y={labelPos.y}
// //         fontSize="14"
// //         fontWeight="bold"
// //         textAnchor="middle"
// //         fill="#333"
// //       >
// //         {item.percentage}%
// //       </SvgText>
// //     );

// //     currentAngle = endAngle;
// //   });

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.chartContainer}>
// //         <Svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
// //           {arcs}
// //           {labels}
// //         </Svg>
// //         <View style={styles.centerContent}>
// //           <Text style={styles.label}>預算額度</Text>
// //           <TouchableOpacity onPress={() => setModalVisible(true)}>
// //             <View style={styles.monthSelector}>
// //               <Text style={styles.month}>{selectedMonth}</Text>
// //               <Text style={styles.dropdown}>▼</Text>
// //             </View>
// //           </TouchableOpacity>
// //           <Text style={styles.amount}>${totalBudget.toLocaleString()}</Text>
// //         </View>
// //       </View>

// //       <Modal
// //         transparent
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //         animationType="fade"
// //       >
// //         <TouchableOpacity
// //           style={styles.modalOverlay}
// //           onPress={() => setModalVisible(false)}
// //           activeOpacity={1}
// //         >
// //           <View style={styles.modalContent}>
// //             <FlatList
// //               data={MONTHS}
// //               keyExtractor={(item) => item}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.monthOption,
// //                     selectedMonth === item && styles.monthOptionSelected
// //                   ]}
// //                   onPress={() => {
// //                     onMonthChange(item);
// //                     setModalVisible(false);
// //                   }}
// //                 >
// //                   <Text
// //                     style={[
// //                       styles.monthOptionText,
// //                       selectedMonth === item && styles.monthOptionTextSelected
// //                     ]}
// //                   >
// //                     {item}
// //                   </Text>
// //                 </TouchableOpacity>
// //               )}
// //               numColumns={4}
// //               scrollEnabled
// //               nestedScrollEnabled
// //             />
// //           </View>
// //         </TouchableOpacity>
// //       </Modal>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     alignItems: 'center',
// //     paddingVertical: 30,
// //     backgroundColor: '#fff'
// //   },
// //   chartContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     position: 'relative'
// //   },
// //   centerContent: {
// //     position: 'absolute',
// //     alignItems: 'center',
// //     zIndex: 10
// //   },
// //   label: {
// //     fontSize: 12,
// //     color: '#999',
// //     marginBottom: 8
// //   },
// //   monthSelector: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8
// //   },
// //   month: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginRight: 4,
// //     color: '#333'
// //   },
// //   dropdown: {
// //     fontSize: 12,
// //     color: '#333'
// //   },
// //   amount: {
// //     fontSize: 32,
// //     fontWeight: 'bold',
// //     color: '#000'
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center'
// //   },
// //   modalContent: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 20,
// //     width: '80%',
// //     maxHeight: '60%'
// //   },
// //   monthOption: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     paddingHorizontal: 8,
// //     alignItems: 'center',
// //     margin: 4,
// //     borderRadius: 8,
// //     backgroundColor: '#f5f5f5'
// //   },
// //   monthOptionSelected: {
// //     backgroundColor: '#4A90E2'
// //   },
// //   monthOptionText: {
// //     fontSize: 14,
// //     color: '#333',
// //     fontWeight: '500'
// //   },
// //   monthOptionTextSelected: {
// //     color: '#fff'
// //   }
// // });

// // export default BudgetChart;