import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

/**
 * data: [{ label, value, color }]  value = 整數或百分比數值
 * total: 總額（數字）
 * monthLabel: 例如 '8月'
 */
export default function BudgetChart({ data, total = 0, monthLabel = '' }) {
  const size = 260;                 // SVG 尺寸
  const radius = 100;               // 圓半徑（軌跡）
  const strokeWidth = 22;           // 圓環粗細
  const gapDeg = 3;                 // 每個分段之間的角度間隙（越大間隙越明顯）
  const cx = size / 2;
  const cy = size / 2;

  const sum = data.reduce((s, d) => s + d.value, 0) || 1; // 避免除以0
  const toRad = (deg) => (Math.PI * deg) / 180;
  const polarToCartesian = (cx, cy, r, deg) => {
    const rad = toRad(deg - 90);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // 產生單一弧線（使用 stroke + 圓角端點）
  const Arc = ({ start, sweep, color }) => {
    // 限制 0 sweep 不畫
    if (sweep <= 0) return null;

    // 使用大弧旗標
    const largeArc = sweep > 180 ? 1 : 0;
    const startPos = polarToCartesian(cx, cy, radius, start);
    const endPos = polarToCartesian(cx, cy, radius, start + sweep);

    const d = [
      'M', startPos.x, startPos.y,
      'A', radius, radius, 0, largeArc, 1, endPos.x, endPos.y,
    ].join(' ');

    return (
      <Path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  // 依序畫出資料分段
  let cursor = 0; // 角度起點（0度在正上方）
  const arcs = data.map((d, i) => {
    // 先扣掉間隙角度
    const sweep = (d.value / sum) * 360 - gapDeg;
    const start = cursor + gapDeg / 2;
    cursor += (d.value / sum) * 360;
    return <Arc key={i} start={start} sweep={Math.max(0, sweep)} color={d.color} />;
  });

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        <G>
          {/* 背景灰環 */}
          <Path
            d={[
              'M', cx, cy - radius,
              'A', radius, radius, 0, 1, 1, cx - 0.01, cy - radius,
            ].join(' ')}
            stroke="#E9EEF5"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {arcs}
        </G>
      </Svg>

      {/* 中央資訊 */}
      <View style={styles.centerBox}>
        <Text style={styles.centerLabel}>預算額度</Text>
        {!!monthLabel && <Text style={styles.centerMonth}>{monthLabel} ▾</Text>}
        <Text style={styles.centerAmount}>{`$${total.toLocaleString()}`}</Text>
      </View>

      {/* 百分比文字（選擇性：若要在環外標示百分比，可在這裡加） */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  centerMonth: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  centerAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
});
