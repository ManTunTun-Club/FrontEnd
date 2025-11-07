// src/features/Home/screens/AiChatbotHome.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker, { types as DTypes } from 'react-native-document-picker';
import Voice from '@react-native-voice/voice';

import BackButton from '../components/BackButton';
import UploadButton from '../components/UploadButton';
import VoiceButton from '../components/VoiceButton';
import InputBar from '../components/InputBar';
import AddToSearchButton from '../components/AddToSearchButton';

// ---- 簡易啟發式：從文字抽出「像商品名」的片段 ----
const CJK = /[\u4e00-\u9fa5]/;
function isProbablyProductName(s) {
  if (!s) return false;
  const t = s.trim();
  if (t.length < 1 || t.length > 25) return false;
  if (/[。？！?！]$/.test(t)) return false;
  if (!CJK.test(t) && !/[a-zA-Z0-9]/.test(t)) return false;
  const stop = ['是','有','買','想','需要','可以','如何','哪個','什麼','為什麼'];
  if (stop.includes(t)) return false;
  return true;
}
function extractProductFromText(s) { return s?.trim() ?? ''; }
function parseAttributes(s) {
  const attrs = {};
  const colorMatch = s.match(/(黑|白|灰|紅|藍|綠|黃|粉|紫|金|銀)色/);
  if (colorMatch) attrs.color = colorMatch[1] + '色';
  const cap = s.match(/(\d+(\.\d+)?)(ml|mL|公升|L|g|kg|片|入|顆|包)/i);
  if (cap) attrs.capacity = cap[0];
  const size = s.match(/(XS|S|M|L|XL|2XL|3XL|\d{2,3}cm)/i);
  if (size) attrs.size = size[0].toUpperCase();
  const qty = s.match(/(\d+)\s*(入|包|組|支|個)/);
  if (qty) attrs.quantity = qty[0];
  return attrs;
}

export default function AiChatbotHome({ navigation, route }) {
  const category = route?.params?.title ?? route?.params?.categoryId ?? '';

  // 對話列表
  const [messages, setMessages] = useState([
    { id: 'sys-hello', role: 'system', type: 'text', text: '你有什麼新的購物計劃呢？' }
  ]);

  // 文字輸入
  const [text, setText] = useState('');

  // ✅ 待送出的圖片（顯示在 InputBar 預覽列）
  const [pendingImages, setPendingImages] = useState([]); // [{uri,name,width,height,mime,size}]

  // 語音
  const [listening, setListening] = useState(false);

  const listRef = useRef(null);
  const scrollToEnd = () => requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));

  // --- 語音事件
  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const t = e.value?.[0] ?? '';
      setText(t);
    };
    Voice.onSpeechError = (e) => {
      setListening(false);
      Alert.alert('語音錯誤', e.error?.message ?? 'Unknown error');
    };
    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  // ✅ 相簿回傳 → 存入 pendingImages（顯示在 InputBar）
  const handlePickedFromAlbum = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    // 以 uri 去重，避免同一張重複出現
    setPendingImages((prev) => {
      const seen = new Set(prev.map(i => i.uri));
      const next = [...prev];
      for (const it of items) {
        if (!seen.has(it.uri)) { next.push(it); seen.add(it.uri); }
      }
      return next;
    });
  };

  // ✅ 從 InputBar 預覽刪除單張
  const handleRemoveImage = (index) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 發送（把文字 + pendingImages 一次送出）
  const handleSend = async (t) => {
    const trimmed = (t ?? '').trim();
    const hasImages = pendingImages.length > 0;
    if (!trimmed && !hasImages) return;

    const now = Date.now();
    const newMsgs = [];

    if (hasImages) {
      // 先送圖片訊息（多張各一則）
      pendingImages.forEach((img, idx) => {
        newMsgs.push({
          id: `${now}-img-${idx}`,
          role: 'user',
          type: 'image',
          uri: img.uri,
          name: img.name,
          mime: img.mime,
          width: img.width,
          height: img.height,
          size: img.size,
        });
      });
    }
    if (trimmed) {
      newMsgs.push({ id: `${now}-text`, role: 'user', type: 'text', text: trimmed });
    }

    setMessages((prev) => [...prev, ...newMsgs]);
    setPendingImages([]);  // ✅ 清空預覽
    setText('');
    scrollToEnd();

    // Mock 機器人回覆（若要同時回傳圖片與文字，可在此擴充）
    const botMsg = { id: String(now + 1), role: 'assistant', type: 'text', text: `收到：${trimmed || '圖片'}` };
    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
      scrollToEnd();
    }, 300);
  };

  // ---（保留）選檔案：若你要用在別顆按鈕，或之後接後端可再接上
  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DTypes.images, DTypes.pdf, DTypes.plainText, DTypes.xlsx, DTypes.csv, DTypes.allFiles],
        presentationStyle: 'fullScreen',
      });
      const fileMsgs = res.map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}`,
        role: 'user',
        type: (f.type?.startsWith('image/')) ? 'image' : 'file',
        name: f.name,
        uri: Platform.OS === 'ios' ? decodeURI(f.uri) : f.uri,
        size: f.size,
        mime: f.type,
      }));
      setMessages((prev) => [...prev, ...fileMsgs]);
      scrollToEnd();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) return;
      Alert.alert('選擇檔案失敗', String(err));
    }
  };

  // --- 語音切換
  const handleVoice = async () => {
    try {
      if (!listening) {
        setListening(true);
        await Voice.start(Platform.OS === 'ios' ? 'zh-TW' : 'zh-TW');
      } else {
        await Voice.stop();
        setListening(false);
      }
    } catch (e) {
      setListening(false);
      Alert.alert('語音錯誤', String(e));
    }
  };

  // ---- 只看最後一則文字訊息，決定是否顯示加入購物車列 ----
  const lastMessage = useMemo(() => messages[messages.length - 1], [messages]);
  const candidateProduct = useMemo(() => {
    if (!lastMessage || lastMessage.type !== 'text') return null;
    const t = lastMessage.text?.trim() ?? '';
    if (!isProbablyProductName(t)) return null;
    return extractProductFromText(t);
  }, [lastMessage]);

  const handleAddToCart = () => {
    if (!candidateProduct) return;
    const attrs = parseAttributes(candidateProduct);
    navigation.navigate('CartDraft', {
      productName: candidateProduct,
      fromCategory: category,
      lastMessage: lastMessage,
      attrs,
    });
  };

  // ---- 對話渲染 ----
  const renderItem = ({ item }) => {
    if (item.type === 'image') {
      return (
        <View style={[styles.bubble, styles.right]}>
          <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
          {!!item.name && <Text style={styles.fileMeta}>{item.name}</Text>}
        </View>
      );
    }
    if (item.type === 'file') {
      return (
        <View style={[styles.bubble, item.role==='user'?styles.right:styles.left]}>
          <Text style={styles.fileName}>📎 {item.name}</Text>
          <Text style={styles.fileMeta}>{item.mime ?? 'file'} · {item.size ?? 0}B</Text>
        </View>
      );
    }
    return (
      <View style={[styles.bubble, item.role==='user'?styles.right:styles.left]}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left','right']}>
      <View style={styles.topBar}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{width:40}} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal:16, paddingTop:12, paddingBottom:12 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToEnd}
      />

      <AddToSearchButton
        visible={!!candidateProduct}
        productName={candidateProduct || ''}
        onAdd={handleAddToCart}
        onDismiss={() => {}}
      />

      {/* 底部 Dock */}
      <View style={styles.inputDock}>
        {/* ✅ 這裡要接 onPicked（不是 onPress） */}
        <UploadButton onPicked={handlePickedFromAlbum} />
        <InputBar
          value={text}
          onChangeText={setText}
          onSend={handleSend}
          placeholder="描述計劃或輸入備註"
          imagesPreview={pendingImages}       // ✅ 把預覽丟進 InputBar
          onRemoveImage={handleRemoveImage}   // ✅ 支援刪除預覽
        />
        <VoiceButton listening={listening} onPress={handleVoice} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{ flex:1, backgroundColor:'#F5F7FA' },
  topBar:{ marginTop:40 ,paddingHorizontal:16, paddingVertical:10, flexDirection:'row', alignItems:'center', gap:12 },
  inputDock:{ flexDirection:'row', alignItems:'center', gap:12, padding:12 },
  bubble:{ maxWidth:'78%', marginVertical:6, paddingHorizontal:12, paddingVertical:10, borderRadius:14, backgroundColor:'#fff',
           shadowColor:'#000', shadowOpacity:0.06, shadowRadius:6, shadowOffset:{width:0,height:2}, elevation:2 },
  left:{ alignSelf:'flex-start', backgroundColor:'#FFFFFF' },
  right:{ alignSelf:'flex-end', backgroundColor:'#E8F1FF' },
  text:{ fontSize:15, color:'#0f172a' },
  fileName:{ fontSize:14, fontWeight:'600', color:'#0f172a' },
  fileMeta:{ fontSize:12, color:'#6b7280', marginTop:4 },
  image: { width: 220, height: 140, borderRadius: 10, borderWidth: 2, borderColor: '#4A90E2' },
});
