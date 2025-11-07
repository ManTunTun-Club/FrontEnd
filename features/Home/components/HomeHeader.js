import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


import HomeHeader from '../components/HomeHeader';
import CategoryCard from '../components/CategoryCard';
import AddNewButton from '../components/AddNewButton';


const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 32 - 16) / 2;


export default function HomeScreen({ navigation }) {
 const insets = useSafeAreaInsets();


 return (
   <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
     {/* Header 改為元件 */}
     <HomeHeader
       title="Budget"
       onPressTitle={() => navigation.navigate('WalletScreen')} // 需要時可點
       showIsland
     />


     <ScrollView
       contentContainerStyle={[
         styles.container,
         { paddingBottom: Math.max(12, insets.bottom + 84) }
       ]}
       showsVerticalScrollIndicator={false}
     >
       {/* 四張卡片：逐一填參數與事件 */}
       <View style={styles.row}>
         <CategoryCard
           title="食物好吃"
           subtitle="剛剛"
           icon="🍽️"
           size={CARD_SIZE}
           onPressCard={() => navigation.navigate('Category', { categoryId: 'food', title: '食物' })}
         />
         <CategoryCard
           title="醫療"
           subtitle="2天前"
           icon="➕"
           size={CARD_SIZE}
           onPressCard={() => navigation.navigate('Category', { categoryId: 'health', title: '醫療' })}
         />
         <CategoryCard
           title="生活用品"
           subtitle="5天前"
           icon="🧻"
           size={CARD_SIZE}
           onPressCard={() => navigation.navigate('Category', { categoryId: 'daily', title: '生活用品' })}
         />
         <CategoryCard
           title="服飾"
           subtitle="10天前"
           icon="👚"
           size={CARD_SIZE}
           onPressCard={() => navigation.navigate('Category', { categoryId: 'clothes', title: '服飾' })}
         />
       </View>


       {/* 新增按鈕 */}
       <AddNewButton
         label="新增"
         onPress={() => navigation.navigate('CreateItem')} // 確保有註冊 CreateItem
       />
     </ScrollView>


     {/* 你的底部 Tab（若已使用 React Navigation Tabs，可移除此假 tab） */}
     <View style={styles.fakeTab} />
   </SafeAreaView>
 );
}


const styles = StyleSheet.create({
 safe: { flex: 1, backgroundColor: '#F3F6F9' },
 container: { paddingHorizontal: 16, paddingTop: 20 },
 row: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
 fakeTab: {
   position: 'absolute', left: 16, right: 16, bottom: 16, height: 64,
   backgroundColor: '#FFFFFF', borderRadius: 22,
   shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
   shadowOffset: { width: 0, height: 4 }, elevation: 8,
 },
});

