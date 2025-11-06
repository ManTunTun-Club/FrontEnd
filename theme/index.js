import { colors } from './colors';
import { typography, spacing, borderRadius, shadows } from './typography';
import { 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize,
  responsiveSpacing,
  responsiveTypography,
  responsiveBorderRadius,
  deviceInfo,
  getResponsiveValue
} from './responsive';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  responsive: {
    width: responsiveWidth,
    height: responsiveHeight,
    fontSize: responsiveFontSize,
    spacing: responsiveSpacing,
    typography: responsiveTypography,
    borderRadius: responsiveBorderRadius,
    deviceInfo,
    getValue: getResponsiveValue,
  },
};

export { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows,
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsiveSpacing,
  responsiveTypography,
  responsiveBorderRadius,
  deviceInfo,
  getResponsiveValue,
};