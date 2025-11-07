import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const CartItemCard = ({ item, onAskPurchase }) => {
  const hasLink = Boolean(item.externalUrl && item.externalUrl.trim());
  const openLink = () => { if (hasLink) Linking.openURL(item.externalUrl); };
  const currency = (n = 0) => `\$ ${Number(n).toLocaleString('en-US')}`;

  return (
    <View style={styles.card}>
      {/* Pre-order date (small text) */}
      {item.preorderDate ? (
        <Text style={styles.preorderText}>預期日期：{item.preorderDate}</Text>
      ) : null}

      {/* main content */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={openLink}
          disabled={!hasLink}
          activeOpacity={0.8}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              onError={() => console.log('Image failed to load:', item.imageUrl)}
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={24} color="#9CA3AF" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.info}>
          <TouchableOpacity
            onPress={openLink}
            disabled={!hasLink}
            activeOpacity={0.6}
            hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
          >
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>

          {/* Recommended Vendor / Credit Card */}
          <View style={styles.metaLine}>
            <Ionicons name="bag-outline" size={14} color="#4B5563" />
            <Text style={styles.metaText}>{item.vendorName || '—'}</Text>
          </View>
          <View style={styles.metaLine}>
            <Ionicons name="card-outline" size={14} color="#4B5563" />
            <Text style={styles.metaText}>{item.cardName || '—'}</Text>
          </View>

          {/* price */}
          <View style={styles.pricePill}>
            <Text style={styles.price}>{currency(item.price)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bottomBar}
        onPress={() => onAskPurchase && onAskPurchase(item)}
        activeOpacity={0.75}
      >
        <Text style={[styles.purchasedText, item.purchased ? styles.purchasedOn : styles.purchasedOff]}>
          已經購買
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#111827" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 20,
  },

  preorderText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#F3F4F6',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  info: { flex: 1 },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#4B5563',
  },

  pricePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
  },

  bottomBar: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  purchasedText: { fontSize: 14, fontWeight: '700' },
  purchasedOn: { color: '#111827' },
  purchasedOff: { color: '#9CA3AF' },
});

CartItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    purchased: PropTypes.bool,
    imageUrl: PropTypes.string,
    externalUrl: PropTypes.string,
    vendorName: PropTypes.string,
    cardName: PropTypes.string,
    preorderDate: PropTypes.string,
  }).isRequired,
  onAskPurchase: PropTypes.func,
};

export default CartItemCard;