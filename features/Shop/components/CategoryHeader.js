import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../../../theme';

const CategoryHeader = ({ title = "今天買點什麼好" }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    height: 64,
    paddingTop: 44,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

CategoryHeader.propTypes = {
  title: PropTypes.string,
};

export default CategoryHeader;