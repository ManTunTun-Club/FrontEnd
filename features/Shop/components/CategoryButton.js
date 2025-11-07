import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
import  Ionicons from 'react-native-vector-icons/Ionicons';
=======
import Ionicons from 'react-native-vector-icons/Ionicons';
>>>>>>> feature/wang-Auth-workflow-done
import PropTypes from 'prop-types';
import { 
  colors, 
  spacing, 
  borderRadius, 
  shadows,
  responsiveWidth,
  responsiveFontSize,
  deviceInfo,
  getResponsiveValue
} from '../../../theme';

/**
 * Category button component
 * Fully matches the visual design of the original web version
 */
const CategoryButton = ({ category, onPress, style }) => {
  // Defensive check: ensure category exists
  if (!category || !category.id) {
    console.warn('CategoryButton: category prop is missing or invalid:', category);
    return null;
  }

  // Select corresponding icon based on category ID
  const getIcon = (categoryId) => {
    const iconProps = {
      size: getResponsiveValue({
        small: 24,
        medium: 28,
        large: 32
      }),
      color: colors.primary,
    };

    switch (categoryId) {
      case 'food':
        return <Ionicons name="restaurant" {...iconProps} />;
      case 'life':
        return <Ionicons name="bag" {...iconProps} />;
      case 'med':
        return <Ionicons name="heart" {...iconProps} />;
      default:
<<<<<<< HEAD
        return <Ionicons name="bag" {...iconProps} />;
=======
        return <Ionicons name="help" {...iconProps} />;
>>>>>>> feature/wang-Auth-workflow-done
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {getIcon(category.id)}
      </View>
      <Text style={styles.text}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: responsiveWidth(12),
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background,
    padding: getResponsiveValue({
      small: spacing.sm,
      medium: spacing.md,
      large: spacing.lg
    }),
    alignItems: 'center',
    justifyContent: 'center',
    gap: getResponsiveValue({
      small: spacing.xs,
      medium: spacing.sm,
      large: spacing.sm
    }),
    ...shadows.sm,
    minHeight: getResponsiveValue({
      small: 80,
      medium: 90,
      large: 100
    }),
    aspectRatio: 1, // Keep square shape
  },
  iconContainer: {
    padding: responsiveWidth(4),
  },
  text: {
    fontSize: responsiveFontSize(12),
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: responsiveFontSize(16),
  },
});

CategoryButton.propTypes = {
  category: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default CategoryButton;