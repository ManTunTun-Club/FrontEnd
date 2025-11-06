import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { 
  colors,
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  getResponsiveValue,
  spacing
} from '../../../theme';

const CartHeader = ({ onBack, categoryName, remainingBudget }) => {
  const insets = useSafeAreaInsets();
  
  const dynamicTopPadding = getResponsiveValue({
    small: insets.top + spacing.md,
    medium: insets.top + spacing.lg,
    large: insets.top + spacing.xl
  });

  return (
    <View style={[styles.container, { paddingTop: dynamicTopPadding }]}>
      <View style={styles.content}>
        {/* Left side - back button */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Center - category name and remaining amount */}
        <View style={styles.centerSection}>
          <Text style={styles.subtitle}>
            {categoryName} - 剩餘額度
          </Text>
          <Text style={styles.budget}>
            NT$ {remainingBudget?.toLocaleString() || 0}
          </Text>
        </View>

        {/* Right side - placeholder to maintain symmetry */}
        <View style={styles.rightSection} />
      </View>
      
      {/* Bottom border area - ensure card content is below this */}
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border?.light || '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100, // Ensure header is on top layer
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getResponsiveValue({
      small: spacing.sm,
      medium: spacing.md,
      large: spacing.lg
    }),
    paddingBottom: getResponsiveValue({
      small: spacing.sm,
      medium: spacing.md,
      large: spacing.md
    }),
    minHeight: responsiveHeight(44),
  },
  bottomBorder: {
    height: responsiveHeight(8),
    backgroundColor: colors.background,
  },
  leftSection: {
    width: responsiveWidth(44),
    justifyContent: 'flex-start',
  },
  backButton: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    backgroundColor: 'transparent', // Remove background color for cleaner look
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -getResponsiveValue({
      small: spacing.xs,
      medium: spacing.sm,
      large: spacing.sm
    }),
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: getResponsiveValue({
      small: spacing.xs,
      medium: spacing.sm,
      large: spacing.md
    }),
  },
  subtitle: {
    fontSize: responsiveFontSize(12),
    color: colors.secondary || '#49769F',
    marginBottom: 2,
    textAlign: 'center',
  },
  budget: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: colors.primary || '#0A4174',
    textAlign: 'center',
  },
  rightSection: {
    width: responsiveWidth(44),
  },
});

CartHeader.propTypes = {
  onBack: PropTypes.func.isRequired,
  categoryName: PropTypes.string.isRequired,
  remainingBudget: PropTypes.number,
};

export default CartHeader;