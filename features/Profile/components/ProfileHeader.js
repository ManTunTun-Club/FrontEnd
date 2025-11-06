// features/Profile/components/ProfileHeader.js
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import PropTypes from 'prop-types';

export default function ProfileHeader({
  name,
  avatarSource,         
  onPressAvatar,
  onPressName,
  style,
  avatarSize = 36,
  gap = 20,             
}) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.centerWrap}>
        {/* 頭像 */}
        <Pressable
          onPress={onPressAvatar}
          hitSlop={10}
          style={{ marginRight: gap }}
          accessibilityRole="button"
          accessibilityLabel="編輯頭像"
        >
          {avatarSource ? (
            <Image
              source={avatarSource}
              style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: '#111',
              }}
            />
          )}
        </Pressable>

        {/* 名稱 */}
        <Pressable
          onPress={onPressName}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="編輯名稱"
        >
          <Text style={styles.title}>{name}</Text>
        </Pressable>
      </View>
    </View>
  );
}

ProfileHeader.propTypes = {
  name: PropTypes.string.isRequired,
  avatarSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onPressAvatar: PropTypes.func,
  onPressName: PropTypes.func,
  style: PropTypes.any,
  avatarSize: PropTypes.number,
  gap: PropTypes.number,
};

ProfileHeader.defaultProps = {
  onPressAvatar: () => {},
  onPressName: () => {},
};



const styles = StyleSheet.create({
  header: {
    height: 72,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6EBF3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2F3A',
  },
});
