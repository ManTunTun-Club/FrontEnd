// src/features/Budget/components/BudgetChart.js

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg'; // 引入 SvgText
import * as d3 from 'd3-shape';
import { BUDGET_COLORS } from '../../../theme/theme-color';

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

const DEFAULTS = {
  size: 280,
  thickness: 25, // 稍微調細一點，比較像設計稿
  emptyColor: '#E8E8E8',
  palette: BUDGET_COLORS,
};

const BudgetChart = ({
  items = [],
  totalBudget = 0,
  selectedMonth = '8月',
  onMonthChange,
  size = DEFAULTS.size,
  thickness = DEFAULTS.thickness,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const outerR = size / 2;
  const innerR = outerR - thickness;
  const labelRadius = outerR + 20; // 標籤顯示在圓餅圖外側

  // 1. 重新計算圓餅圖專用的資料 (計算每個類別佔總預算的比例)
  const chartData = useMemo(() => {
    if (!items || items.length === 0 || totalBudget === 0) {
      return [{ label: '空', value: 1, color: DEFAULTS.emptyColor, percentage: 0 }];
    }

    return items.map(item => ({
      label: item.name,
      value: item.amount,
      color: item.color,
      // 計算佔比：(該類別金額 / 總預算) * 100
      percentage: Math.round((item.amount / totalBudget) * 100),
    }));
  }, [items, totalBudget]);

  // 2. 使用 d3.pie 計算扇形角度
  const arcs = useMemo(() => {
    const pieGen = d3.pie()
      .value(d => d.value)
      .sort(null) // 不排序，保持與列表順序一致
      .padAngle(0.05); // 設定扇形之間的間隙 (類似設計稿的圓角間隔)

    const arcGen = d3.arc()
      .outerRadius(outerR)
      .innerRadius(innerR)
      .cornerRadius(thickness / 2); // 設定圓角

    const arcData = pieGen(chartData);

    return arcData.map((d, i) => {
      // 計算標籤位置
      const [centroidX, centroidY] = d3.arc()
        .outerRadius(labelRadius)
        .innerRadius(labelRadius)
        .centroid(d);

      return {
        key: i,
        path: arcGen(d),
        color: chartData[i].color,
        percentage: chartData[i].percentage,
        labelX: centroidX,
        labelY: centroidY,
        // 只有當佔比大於 3% 才顯示標籤，避免擠在一起
        showLabel: chartData[i].percentage > 3,
      };
    });
  }, [chartData, outerR, innerR, thickness, labelRadius]);

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width={size + 60} height={size + 60}> 
          <G x={(size + 60) / 2} y={(size + 60) / 2}>
            {/* 繪製扇形 */}
            {arcs.map((a) => (
              <Path key={a.key} d={a.path} fill={a.color} />
            ))}

            {/* 繪製百分比標籤 (選擇性，設計稿上有) */}
            {arcs.map((a) => a.showLabel && (
              <SvgText
                key={`label-${a.key}`}
                x={a.labelX}
                y={a.labelY}
                fill="#333"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {`${a.percentage}%`}
              </SvgText>
            ))}
          </G>
        </Svg>

        {/* 中央資訊 */}
        <View style={styles.centerContent}>
          <Text style={styles.centerLabel}>預算額度</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.monthSelector}>
            <Text style={styles.month}>{selectedMonth}</Text>
            <Text style={styles.dropdown}>▼</Text>
          </TouchableOpacity>
          <Text style={styles.amount}>${Number(totalBudget).toLocaleString()}</Text>
        </View>
      </View>

      {/* 月份選擇 Modal (維持不變) */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={MONTHS}
              keyExtractor={m => m}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.monthOption, selectedMonth === item && styles.monthOptionSelected]}
                  onPress={() => {
                    onMonthChange?.(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.monthOptionText, selectedMonth === item && styles.monthOptionTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#fff' },
  chartWrapper: { alignItems: 'center', justifyContent: 'center', width: 340, height: 340 }, // 調整容器大小以容納外部標籤
  centerContent: { position: 'absolute', alignItems: 'center' },
  centerLabel: { fontSize: 14, color: '#999', marginBottom: 4 },
  monthSelector: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  month: { fontSize: 18, fontWeight: '600', marginRight: 4, color: '#333' },
  dropdown: { fontSize: 12, color: '#333' },
  amount: { fontSize: 36, fontWeight: 'bold', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%' },
  monthOption: { flex: 1, padding: 12, margin: 4, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center' },
  monthOptionSelected: { backgroundColor: '#4A90E2' },
  monthOptionText: { color: '#333' },
  monthOptionTextSelected: { color: '#fff' },
});

export default BudgetChart;