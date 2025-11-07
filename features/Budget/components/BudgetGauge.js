// src/features/Budget/components/BudgetGauge.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import * as d3 from 'd3-shape';

const hexToRgba = (hex, alpha = 1) => {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const BudgetGauge = ({
  totalBudget = 0,
  spent = 0,
  planned = 0,
  color = '#4A90E2',
  size = 300,
  thickness = 30,
}) => {
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const startAngle = -Math.PI / 2;
  const endAngle = Math.PI / 2;

  const arcGen = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .startAngle(startAngle);

  const backgroundArcPath = arcGen({ endAngle });
  const totalCart = spent + planned;
  const spentRatio = Math.min(1, totalBudget > 0 ? spent / totalBudget : 0);
  const cartRatio = Math.min(1, totalBudget > 0 ? totalCart / totalBudget : 0);

  const cartEndAngle = startAngle + (Math.PI * cartRatio);
  const spentEndAngle = startAngle + (Math.PI * spentRatio);

  const cartArcPath = arcGen({ endAngle: cartEndAngle });
  const spentArcPath = arcGen({ endAngle: spentEndAngle });

  return (
    <View style={[styles.container, { width: size, height: radius + 20 }]}>
      <Svg width={size} height={radius + thickness}>
        <G x={radius} y={radius}>
          <Path d={backgroundArcPath} fill="#E8E8E8" />
          <Path d={cartArcPath} fill={hexToRgba(color, 0.5)} />
          <Path d={spentArcPath} fill={color} />
        </G>
      </Svg>

      {/* 中央資訊 */}
      <View style={[styles.centerInfo, { height: radius, bottom: 0 }]}>
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>8月</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
        <Text style={styles.label}>預計花費</Text>
        <Text style={[styles.amount, { color }]}>{`$${totalCart.toLocaleString()}`}</Text>
      </View>

      {/* 刻度文字 */}
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
    paddingBottom: 20,
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
  leftLabel: { left: 0 },
  rightLabel: { right: 0 },
});

export default BudgetGauge;
