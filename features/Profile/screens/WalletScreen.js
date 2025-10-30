import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

const cards = [
  {
    id: '1',
    title: '玉山 Unicard',
    amount: 2000,
  },
  {
    id: '2',
    title: '其他卡片',
    //image: require('../../../assets/icons/unicard.png'),
    amount: 1800,
  },
];

export default function Wallet() {
  const flatListRef = useRef(null);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 頂部區塊 */}
      <View style={styles.header}>
        <Text style={styles.headerTextGray}>平台</Text>
        <Text style={styles.headerText}>Cards</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* 橫向滑動卡片 */}
      <FlatList
        ref={flatListRef}
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: CARD_SPACING }}
      />

      {/* 消費總額 */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>本月 消費金額：</Text>
        <Text style={styles.amountValue}>$2,000</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTextGray: {
    fontSize: 16,
    color: '#777',
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    position: 'absolute',
    right: 32,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5DA3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  card: {
    width: CARD_WIDTH,
    height: 220,
    backgroundColor: '#3A847C',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 2,
    marginTop: 8,
  },
  amountContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  amountLabel: {
    color: '#888',
    fontSize: 14,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginTop: 4,
  },
});
