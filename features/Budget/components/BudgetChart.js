// src/features/Budget/components/BudgetChart.js

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3-shape';
import { BUDGET_COLORS } from '../../../theme/theme-color';

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

const DEFAULTS = {
  thickness: 25,
  emptyColor: '#E8E8E8',
  palette: BUDGET_COLORS,
};

const BudgetChart = ({
  items = [],
  totalBudget = 0,
  selectedMonth = '8月',
  onMonthChange,
  size: customSize,
  thickness = DEFAULTS.thickness,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);

 
  const size = customSize || (screenWidth * 0.7);

  const outerR = size / 2;
  const innerR = outerR - thickness;
  const labelRadius = outerR + 17;

  const chartData = useMemo(() => {
    if (!items || items.length === 0 || totalBudget === 0) {
      return [{ label: '空', value: 1, color: DEFAULTS.emptyColor, percentage: 0 }];
    }
    return items.map(item => ({
      label: item.name,
      value: item.amount,
      color: item.color,
      percentage: Math.round((item.amount / totalBudget) * 100),
    }));
  }, [items, totalBudget]);

  const arcs = useMemo(() => {
    const pieGen = d3.pie()
        .value(d => d.value)
        .sort(null)
        .padAngle(0.05);
    const arcGen = d3.arc()
        .outerRadius(outerR)
        .innerRadius(innerR)
        .cornerRadius(thickness / 2);
    const arcData = pieGen(chartData);
    return arcData.map((d, i) => {
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
        showLabel: chartData[i].percentage > 3,
      };
    });
  }, [chartData, outerR, innerR, thickness, labelRadius]);
  const wrapperSize = size + 150;

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: wrapperSize, height: wrapperSize }]}>
        <Svg width={wrapperSize} height={wrapperSize}> 
          <G x={wrapperSize / 2} y={wrapperSize / 2}>
            {arcs.map((a) => (
              <Path key={a.key} d={a.path} fill={a.color} />
            ))}
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

        <View style={styles.centerContent}>
          <Text style={styles.centerLabel}>預算額度</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.monthSelector}>
            <Text style={styles.month}>{selectedMonth}</Text>
            <Text style={styles.dropdown}>▼</Text>
          </TouchableOpacity>
          <Text style={[styles.amount, { fontSize: size * 0.13 }]}>
            ${Number(totalBudget).toLocaleString()}
          </Text>
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
  container: {
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#fff',
    zIndex: 1, 
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -50,
  },
  centerContent: { position: 'absolute', alignItems: 'center' },
  centerLabel: { fontSize: 14, color: '#999', marginBottom: 4 },
  monthSelector: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  month: { fontSize: 18, fontWeight: '600', marginRight: 4, color: '#333' },
  dropdown: { fontSize: 12, color: '#333' },
  amount: { fontWeight: 'bold', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%' },
  monthOption: { flex: 1, padding: 12, margin: 4, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center' },
  monthOptionSelected: { backgroundColor: '#4A90E2' },
  monthOptionText: { color: '#333' },
  monthOptionTextSelected: { color: '#fff' },
});

export default BudgetChart;
