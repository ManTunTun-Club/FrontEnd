/**
 * Donut 圓餅圖（自含預設設定）
 * - 依賴：react-native-svg + d3-shape
 * - 使用方式 A（建議）：直接丟 items，並指定 labelKey / valueKey / colorKey
 *   <BudgetChart items={items} labelKey="name" valueKey="amount" colorKey="color" />
 * - 使用方式 B（相容舊版）：傳 chartData = [{ label, value, color }]
 * - 由父層傳入 totalBudget、selectedMonth、onMonthChange
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import * as d3 from 'd3-shape';
import { BUDGET_COLORS } from '../../../theme/theme-color';

/** 月份列表（內建給月份選單用） */
const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

/** 本元件內的預設視覺設定（可用 props 覆寫） */
const DEFAULTS = {
  size: 280,            // 整個 SVG 寬高
  thickness: 28,        // donut 厚度（外半徑 - 內半徑）
  emptyColor: '#E8E8E8',// 沒資料時顯示的顏色
  palette: BUDGET_COLORS, // 缺色時的預設調色盤（與 App 顏色一致）
};

const BudgetChart = ({
  /** 方式一：給 items（建議，會自動標準化為 pie 用的 {label,value,color}） */
  items = [],
  /** 方式二：相容舊介面 */
  chartData = [],
  /** 中央顯示的總額 */
  totalBudget = 0,
  /** 月份顯示/切換 */
  selectedMonth = '8月',
  onMonthChange,
  /** 覆寫預設視覺 */
  size = DEFAULTS.size,
  thickness = DEFAULTS.thickness,
  /** 告知 items 的欄位名稱（若你用 items） */
  labelKey = 'name',
  valueKey = 'amount',
  colorKey = 'color',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // 幾何設定
  const outerR = size / 2;
  const innerR = Math.max(0, outerR - thickness);

  /**
   * 標準化資料：
   * - 優先使用 items（推薦），否則退回 chartData
   * - 若 item 沒有 color，用預設調色盤依索引補色，確保卡片/圖表顏色一致
   * - 沒資料時顯示單一灰環，避免畫面空白
   */
  const series = useMemo(() => {
    const src = (items && items.length) ? items : chartData;
    if (!src || !src.length) return [{ label: '空', value: 1, color: DEFAULTS.emptyColor }];

    return src.map((it, idx) => ({
      label: it[labelKey] ?? it.label ?? `項目${idx + 1}`,
      value: Number(it[valueKey] ?? it.value) || 0,
      color: it[colorKey] ?? it.color ?? DEFAULTS.palette[idx % DEFAULTS.palette.length],
    }));
  }, [items, chartData, labelKey, valueKey, colorKey]);

  /**
   * 產生扇形路徑：
   * - 使用 d3.pie 依 value 計算比例
   * - 使用 d3.arc 產生 Path d
   */
  const arcs = useMemo(() => {
    const pieGen = d3.pie()
      .value((d) => Math.max(0, Number(d.value) || 0)) // 防守：負數/NaN -> 0
      .sort(null);

    const arcGen = d3.arc().outerRadius(outerR).innerRadius(innerR);

    return pieGen(series).map((d, idx) => ({
      key: `${series[idx].label}-${idx}`,
      path: arcGen(d),
      color: series[idx].color || DEFAULTS.emptyColor,
    }));
  }, [series, outerR, innerR]);

  return (
    <View style={styles.container}>
      {/* 圖表 */}
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <G x={outerR} y={outerR}>
            {arcs.map((a) => (
              <Path key={a.key} d={a.path} fill={a.color} />
            ))}
            {/* 內圈淡淡的白：讓 donut 更清晰（可移除） */}
            <Circle cx={0} cy={0} r={innerR} fill="white" opacity={0.02} />
          </G>
        </Svg>

        {/* 中央資訊：標題 / 月份選擇 / 總額 */}
        <View style={styles.centerContent}>
          <Text style={styles.centerLabel}>預算額度</Text>

          <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7}>
            <View style={styles.monthSelector}>
              <Text style={styles.month}>{selectedMonth}</Text>
              <Text style={styles.dropdown}>▼</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.amount}>${Number(totalBudget || 0).toLocaleString()}</Text>
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
              keyExtractor={(m) => m}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.monthOption,
                    selectedMonth === item && styles.monthOptionSelected,
                  ]}
                  onPress={() => {
                    onMonthChange?.(item);
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
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

/* ----------------------------- styles ----------------------------- */

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
  // modal
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
