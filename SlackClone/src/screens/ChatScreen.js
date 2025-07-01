import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, Image,
  StyleSheet, KeyboardAvoidingView, SafeAreaView, Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChatScreen({ route, navigation }) {
  const { channel, dmGroup } = route.params;
  const isDM = !!dmGroup;
  const roomId = isDM ? `dm-${dmGroup.id}` : `channel-${channel.id}`;
  const flatRef = useRef();

  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', avatar: '' });
  const [dmOtherUser, setDmOtherUser] = useState(null); // <-- for DM receiver

  const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
  const WS_BASE = BACKEND_URL.replace('http', 'ws');

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('access');
      if (!token) return;
      const res = await fetch(`${BACKEND_URL}/api/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser({ id: data.id, name: data.username, avatar: data.avatar || '' });
        // For DMs, find the other user
        if (isDM && dmGroup && dmGroup.participants) {
          const other = dmGroup.participants.find(u => u.id !== data.id);
          setDmOtherUser(other || null);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${WS_BASE}/ws/chat/${isDM ? `dm/${dmGroup.id}` : `channel/${channel.id}`}/`);

    socket.onopen = () => console.log('✅ WebSocket connected');
    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      // Normalize WebSocket message
      setMsgs(prev => [{
        message: data.message || data.content,
        sender: typeof data.sender === 'object' ? data.sender : { username: data.sender },
        receiver: typeof data.receiver === 'object' ? data.receiver : (dmOtherUser ? dmOtherUser : { username: '' })
      }, ...prev]);
    };
    socket.onerror = e => console.error('WebSocket error:', e.message);
    socket.onclose = () => console.log('❌ WebSocket closed');

    setWs(socket);
    return () => socket.close();
  }, [roomId, dmOtherUser]);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('access');
      if (!token) return Alert.alert('Error', 'Login required');
      const url = `${BACKEND_URL}/api/messages/${isDM ? 'dm' : 'channel'}/${isDM ? dmGroup.id : channel.id}/`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return console.error('Failed to fetch messages');
      const data = await res.json();
      // Normalize messages to always have sender and receiver objects
      const formatted = data.map(m => ({
        message: m.content,
        sender: typeof m.sender === 'object' ? m.sender : { username: m.sender },
        receiver: typeof m.receiver === 'object' ? m.receiver : (dmOtherUser ? dmOtherUser : { username: '' })
      }));
      setMsgs(formatted.reverse());
    })();
  }, [roomId, dmOtherUser]);

  const send = async () => {
    const text = input.trim();
    if (!text || !ws) return;

    setInput(''); // ✅ Clear input immediately

    const token = await AsyncStorage.getItem('access');
    if (!token) return Alert.alert('Error', 'Authentication failed');

    // Always send sender and receiver as objects
    const payload = {
      message: text,
      sender: { id: currentUser.id, username: currentUser.name },
      receiver: isDM && dmOtherUser ? { id: dmOtherUser.id, username: dmOtherUser.username } : null
    };
    ws.send(JSON.stringify(payload));

    // Only POST to API for persistence, do not update msgs here
    const apiUrl = `${BACKEND_URL}/api/messages/${isDM ? 'dm' : 'channel'}/${isDM ? dmGroup.id : channel.id}/`;
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: text })
    });
    // Do NOT update msgs here! Only WebSocket should add new messages
  };

  // Show only sender name above every message (for both channel and DM)
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.wrap]}>
        <View style={[styles.bub, item.sender?.id === currentUser.id ? styles.my : styles.oth]}>
          <Text style={[styles.user, { fontWeight: 'bold' }]}>
            {item.sender?.username || ''}
          </Text>
          <Text>{item.message}</Text>
        </View>
      </View>
    );
  };

  const getOtherUserName = () => {
    if (!isDM || !dmGroup.participants || !currentUser.id) return dmGroup?.name || 'DM';
    if (dmGroup.participants.length === 2) {
      const other = dmGroup.participants.find(u => u.id !== currentUser.id);
      return other ? other.username : 'DM';
    }
    const others = dmGroup.participants.filter(u => u.id !== currentUser.id).map(u => u.username);
    return others.length ? others.join(', ') : 'DM';
  };

  return (
    <SafeAreaView style={styles.flex}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isDM ? getOtherUserName() : `#${channel?.name || 'Channel'}`}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={msgs}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        inverted
        ref={flatRef}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inpWrap}>
          <TextInput
            style={styles.inp}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message…"
          />
          <TouchableOpacity onPress={send} disabled={!input.trim()}>
            <Ionicons name="send" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: '600' },
  wrap: { flexDirection: 'row', padding: 8 },
  l: { justifyContent: 'flex-start' },
  r: { justifyContent: 'flex-end', flexDirection: 'row-reverse' },
  av: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 8 },
  bub: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
  },
  my: { backgroundColor: '#DCF8C5' },
  oth: { backgroundColor: '#ececec' },
  user: { fontSize: 12, color: '#555' },
  inpWrap: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    alignItems: 'center'
  },
  inp: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 8,
    marginRight: 8
  }
});

