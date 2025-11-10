import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { 
  colors, 
  typography, 
  spacing,
  responsiveFontSize,
  getResponsiveValue
} from '../../../theme';
import Button from './Button';

const EmptyPage = ({
  icon = '📦',
  title = '購物車是空的',
  description = '目前沒有任何內容',
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

EmptyPage.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  actionTitle: PropTypes.string,
  onAction: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getResponsiveValue({
      small: spacing.lg,
      medium: spacing.xl,
      large: spacing.xxl
    }),
  },
  icon: {
    fontSize: responsiveFontSize(48),
    marginBottom: getResponsiveValue({
      small: spacing.md,
      medium: spacing.lg,
      large: spacing.xl
    }),
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: getResponsiveValue({
      small: spacing.xs,
      medium: spacing.sm,
      large: spacing.md
    }),
    lineHeight: responsiveFontSize(32),
  },
  description: {
    fontSize: responsiveFontSize(16),
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: responsiveFontSize(24),
    marginBottom: getResponsiveValue({
      small: spacing.lg,
      medium: spacing.xl,
      large: spacing.xxl
    }),
    maxWidth: '80%',
  },
  actionButton: {
    marginTop: getResponsiveValue({
      small: spacing.sm,
      medium: spacing.md,
      large: spacing.lg
    }),
    minWidth: 200,
  },
});

export default EmptyPage;