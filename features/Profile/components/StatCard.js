// features/Profile/components/SavingCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../../../theme/theme-color';

export default function SavingCard({
  monthLabel,       // 月份
  totalSaved,       // 共省下
  cashDiscount,     // 現金折扣
  pointsRebate,     // 回饋點數
  onPressMonth,     // 換月份
}) {
  const bg = COLORS.primary;
  const fg = COLORS.onPrimary;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      {/* 第一行 */}
      <View style={styles.row}>
        <View style={styles.monthBlock}>
          <Text style={[styles.monthText, { color: fg }]}>本月</Text>
          <Text style={[styles.monthValue, { color: fg }]}>{monthLabel}</Text>

          <Pressable
            onPress={onPressMonth}
            hitSlop={10}
            style={styles.monthArrowBtn}
          >
            <Image
              source={require('../../../assets/icons/arrow-right-2.png')}
              style={[styles.monthArrowIcon, { tintColor: fg, transform: [{ rotate: '90deg' }] }]}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* 總省下金額 */}
        <Text style={[styles.total, { color: fg }]}>
          ${totalSaved.toLocaleString()}
        </Text>
      </View>

      {/* 第二行 */}
      <View style={styles.line}>
        <Text style={[styles.label, { color: fg, opacity: 0.95 }]}>省下的金額</Text>
      </View>

      {/* 第三行：現金折扣 */}
      <View style={styles.line}>
        <Text style={[styles.label, { color: fg, opacity: 0.85 }]}>現金折扣</Text>
        <Text style={[styles.value, { color: fg }]}>
          ${cashDiscount.toLocaleString()}
        </Text>
      </View>

      {/* 第四行：回饋點數 */}
      <View style={[styles.line, { marginTop: 4 }]}>
        <Text style={[styles.label, { color: fg, opacity: 0.85 }]}>回饋點數</Text>
        <Text style={[styles.value, { color: fg }]}>
          ${pointsRebate.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

SavingCard.propTypes = {
  monthLabel: PropTypes.string.isRequired,
  totalSaved: PropTypes.number.isRequired,
  cashDiscount: PropTypes.number.isRequired,
  pointsRebate: PropTypes.number.isRequired,
  onPressMonth: PropTypes.func,
};

SavingCard.defaultProps = {
  onPressMonth: () => {},
};



const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  monthBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: { fontSize: 16, fontWeight: '800', marginRight: 6 },
  monthValue: { fontSize: 16, fontWeight: '800' },
  monthArrowBtn: { marginLeft: 4, padding: 2 },
  monthArrowIcon: { width: 14, height: 14, opacity: 0.95 },

  total: { fontSize: 18, fontWeight: '800' },

  line: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 15, fontWeight: '700' },
  value: { fontSize: 15, fontWeight: '700' },
});
