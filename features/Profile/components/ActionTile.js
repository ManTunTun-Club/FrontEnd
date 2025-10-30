import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default function ActionTile({label, onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tile}>
      <View style={styles.bell}/>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

ActionTile.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

ActionTile.defaultProps = {
  onPress: () => {},
};

const styles = StyleSheet.create({
  tile: {
    width: 92, height: 92, borderRadius: 16,
    backgroundColor: '#F5F7FB', alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 1, borderColor: '#E6EBF3',
  },
  bell: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#5DA3FF', opacity: 0.6, marginBottom: 8,
  },
  label: {color: '#6B7A90', fontSize: 12},
});
