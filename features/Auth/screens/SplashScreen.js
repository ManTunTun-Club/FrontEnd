import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StatusBar, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
        ]).start();

        const t = setTimeout(() => navigation.replace('Login'), 1500);
        return () => clearTimeout(t);
    }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Animated.Image
            source={require('../../../assets/icons/LOGO.png')}
            style={[styles.logo, { opacity, transform: [{ scale }] }]}
            resizeMode="contain"
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems:'center', justifyContent:'center', backgroundColor:'#FFFFFF' },
    logo: { width: 120, height: 120 },
});
