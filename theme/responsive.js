import { Dimensions, PixelRatio } from 'react-native';

// Get device screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design file base dimensions (usually based on iPhone 14)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Responsive width calculation
 * @param {number} size - Size in design file
 * @returns {number} - Adapted size
 */
export const responsiveWidth = (size) => {
  return PixelRatio.roundToNearestPixel((size * SCREEN_WIDTH) / BASE_WIDTH);
};

/**
 * Responsive height calculation
 * @param {number} size - Size in design file
 * @returns {number} - Adapted size
 */
export const responsiveHeight = (size) => {
  return PixelRatio.roundToNearestPixel((size * SCREEN_HEIGHT) / BASE_HEIGHT);
};

/**
 * Responsive font size calculation
 * @param {number} size - Font size in design file
 * @returns {number} - Adapted font size
 */
export const responsiveFontSize = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.max(newSize, size * 0.8); // Ensure font doesn't get too small
};

/**
 * Device dimension information
 */
export const deviceInfo = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isShortDevice: SCREEN_HEIGHT < 700,
  isTallDevice: SCREEN_HEIGHT >= 900,
};

/**
 * Responsive spacing
 */
export const responsiveSpacing = {
  xs: responsiveWidth(4),
  sm: responsiveWidth(8),
  md: responsiveWidth(16),
  lg: responsiveWidth(24),
  xl: responsiveWidth(32),
  xxl: responsiveWidth(48),
};

/**
 * Responsive typography sizes
 */
export const responsiveTypography = {
  fontSize: {
    xs: responsiveFontSize(10),
    sm: responsiveFontSize(12),
    md: responsiveFontSize(14),
    lg: responsiveFontSize(16),
    xl: responsiveFontSize(18),
    xxl: responsiveFontSize(20),
    title: responsiveFontSize(24),
    heading: responsiveFontSize(28),
  },
  lineHeight: {
    xs: responsiveFontSize(14),
    sm: responsiveFontSize(16),
    md: responsiveFontSize(20),
    lg: responsiveFontSize(22),
    xl: responsiveFontSize(24),
    xxl: responsiveFontSize(28),
    title: responsiveFontSize(32),
    heading: responsiveFontSize(36),
  },
};

/**
 * Responsive border radius
 */
export const responsiveBorderRadius = {
  sm: responsiveWidth(4),
  md: responsiveWidth(8),
  lg: responsiveWidth(12),
  xl: responsiveWidth(16),
  full: responsiveWidth(999),
};

/**
 * Return different values based on device size
 * @param {object} sizes - { small, medium, large }
 * @returns {any} - Value corresponding to the size
 */
export const getResponsiveValue = (sizes) => {
  if (deviceInfo.isSmallDevice && sizes.small !== undefined) {
    return sizes.small;
  }
  if (deviceInfo.isMediumDevice && sizes.medium !== undefined) {
    return sizes.medium;
  }
  if (deviceInfo.isLargeDevice && sizes.large !== undefined) {
    return sizes.large;
  }
  return sizes.medium || sizes.large || sizes.small;
};