import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { colors, spacing, borderRadius, responsiveWidth, responsiveHeight } from '../../../theme';

const LoadingSkeleton = ({ 
  width = '100%', 
  height = 20,
  borderRadius: customBorderRadius = borderRadius.sm,
  style,
  animated = true,
}) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      
      return () => animation.stop();
    }
  }, [animated, opacity]);

  const skeletonStyle = [
    styles.skeleton,
    {
      width,
      height,
      borderRadius: customBorderRadius,
      opacity: animated ? opacity : 0.3,
    },
    style,
  ];

  return <Animated.View style={skeletonStyle} />;
};

LoadingSkeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.number,
  borderRadius: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  animated: PropTypes.bool,
};

// Default skeleton screen combination
export const CardSkeleton = () => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      <LoadingSkeleton width={responsiveWidth(60)} height={responsiveHeight(60)} borderRadius={borderRadius.md} />
      <View style={styles.cardContent}>
        <LoadingSkeleton width="70%" height={responsiveHeight(16)} />
        <LoadingSkeleton width="50%" height={responsiveHeight(14)} style={styles.cardSecondLine} />
      </View>
    </View>
    <LoadingSkeleton width="100%" height={1} style={styles.divider} />
    <View style={styles.cardFooter}>
      <LoadingSkeleton width="40%" height={responsiveHeight(14)} />
      <LoadingSkeleton width={responsiveWidth(24)} height={responsiveHeight(24)} borderRadius={borderRadius.full} />
    </View>
  </View>
);

export const ListSkeleton = ({ count = 3 }) => (
  <View style={styles.listContainer}>
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border.light,
  },
  cardContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: responsiveWidth(spacing.md),
    marginBottom: responsiveHeight(spacing.md),
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(spacing.md),
  },
  cardContent: {
    flex: 1,
    marginLeft: responsiveWidth(spacing.md),
  },
  cardSecondLine: {
    marginTop: responsiveHeight(spacing.sm),
  },
  divider: {
    marginVertical: responsiveHeight(spacing.sm),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(spacing.sm),
  },
  listContainer: {
    padding: responsiveWidth(spacing.md),
  },
});

export default LoadingSkeleton;