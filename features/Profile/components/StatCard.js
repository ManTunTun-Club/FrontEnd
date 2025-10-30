import React from 'react';
import {View, Text, StyleSheet, Image, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../../../theme/theme-color';
import { useNavigation } from '@react-navigation/native';

export default function StatCard({title, amount, onPress }) {
  const bg = COLORS.primary;          
  const textcolor = COLORS.onPrimary;  
  const navigation = useNavigation();
  
  return (
    <View style={[styles.card, {backgroundColor: bg}]}>
      <View>
        <Text style={[styles.gray, {color: textcolor}]}>總計</Text>
        <Text style={[styles.amount, {color: textcolor}]}>
          ${amount.toLocaleString()}
        </Text>
      </View>
      
      <Pressable
        onPress={() => navigation.navigate('WalletScreen')}
        style={styles.iconButton}
        hitSlop={12}
      >
        <Image
          source={require('../../../assets/icons/arrow-right.png')}
          style={[styles.icon, { tintColor: COLORS.onPrimary }]}
        />
      </Pressable>
    </View>
  );
}

StatCard.propTypes = {
  title: PropTypes.string,         
  amount: PropTypes.number.isRequired,
  onPress: PropTypes.func,
};

StatCard.defaultProps = {
  onPress: () => {},
};

const styles = StyleSheet.create({
  card: {
    height: 96, borderRadius: 16, paddingHorizontal: 20,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 12,
  },
  gray: {color: 'white', opacity: 0.85, marginBottom: 6},
  amount: {color: 'white', fontSize: 28, fontWeight: '700'},
  arrow: {color: 'white', fontSize: 22, fontWeight: '600'},
});
