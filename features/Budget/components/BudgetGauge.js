// src/features/Budget/components/BudgetGauge.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3-shape';

// 將 HEX 顏色轉為 RGBA 並加上透明度 (用於淺色軌道)
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const BudgetGauge = ({
  totalBudget = 0,    // 總預算 (100% 基底)
  spent = 0,          // 已花費 (深色)
  planned = 0,        // 預計花費 (淺色的一部分)
  color = '#4A90E2',  // 主題色
  size = 300,         // 寬度
  thickness = 30,     // 圓環粗細
}) => {
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const centerY = radius; // 半圓的圓心在底部

  // D3 Arc 生成器
  // 設定範圍從 -90度 (左) 到 +90度 (右)
  const startAngle = -Math.PI / 2;
  const endAngle = Math.PI / 2;

  const arcGen = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .startAngle(startAngle);

  // 背景軌道 (灰色，永遠是滿的 100%)
  const backgroundArcPath = arcGen({ endAngle: endAngle });

  // 計算進度比例 (限制最大為 1)
  const totalCart = spent + planned;
  const spentRatio = Math.min(1, totalBudget > 0 ? spent / totalBudget : 0);
  const cartRatio = Math.min(1, totalBudget > 0 ? totalCart / totalBudget : 0);

  // 購物車總額軌道 (淺色，包含已買+預計)
  // 角度 = 起始角 + (總角度範圍 * 比例)
  const cartEndAngle = startAngle + (Math.PI * cartRatio);
  const cartArcPath = arcGen({ endAngle: cartEndAngle });

  // 已購買軌道 (深色，疊在淺色上面)
  const spentEndAngle = startAngle + (Math.PI * spentRatio);
  const spentArcPath = arcGen({ endAngle: spentEndAngle });

  return (
    <View style={[styles.container, { width: size, height: radius + 20 }]}>
      <Svg width={size} height={radius + thickness}> 
        <G x={radius} y={radius}>
          {/* 底層灰色軌道 */}
          <Path d={backgroundArcPath} fill="#E8E8E8" />
          {/* 中層淺色軌道 (目前購物車總額) - 用半透明的主題色 */}
          <Path d={cartArcPath} fill={hexToRgba(color, 0.5)} />
          {/* 上層深色軌道 (已購買) */}
          <Path d={spentArcPath} fill={color} />
        </G>
      </Svg>

      {/* 中央文字資訊 */}
      <View style={[styles.centerInfo, { height: radius, bottom: 0 }]}>
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>8月</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
        <Text style={styles.label}>預計花費</Text>
        <Text style={[styles.amount, { color: color }]}>
          ${totalCart.toLocaleString()}
        </Text>
      </View>

      {/* 左右百分比標籤 */}
      <Text style={[styles.percentLabel, styles.leftLabel]}>0%</Text>
      <Text style={[styles.percentLabel, styles.rightLabel]}>100%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  centerInfo: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20, // 文字離底部的距離
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  percentLabel: {
    position: 'absolute',
    bottom: 0,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
  },
  leftLabel: {
    left: 0,
  },
  rightLabel: {
    right: 0,
  },
});

export default BudgetGauge;