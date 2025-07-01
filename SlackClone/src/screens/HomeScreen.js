import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, SafeAreaView, LayoutAnimation, Platform, UIManager,
  Alert, Share, ActivityIndicator, Modal, TextInput, Animated, Pressable
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
const userAvatar = require('../../assets/profile-icon.png');
const workspaceName = 'SlackClone';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { profileImage } = useProfile() || {};

  const [channels, setChannels] = useState([]);
  const [chainChannels, setChainChannels] = useState([]);
  const [dmGroups, setDMGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dmModalVisible, setDMModalVisible] = useState(false);
  const [newChannel, setNewChannel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDMsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [userStatus, setUserStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isUserActive, setIsUserActive] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Animated value for chevron rotation
  const channelsChevron = useState(new Animated.Value(channelsOpen ? 0 : 1))[0];
  const dmsChevron = useState(new Animated.Value(dmsOpen ? 0 : 1))[0];

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem('access');
      if (!token) return navigation.navigate('Login');
      // Fetch current user info
      try {
        const res = await fetch(`${BACKEND_URL}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.id);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
      await Promise.all([
        fetchChannels(token),
        fetchChainChannels(token),
        fetchDMGroups(token),
        fetchUsers(token)
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchChannels = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/channels/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setChannels(data || []);
    } catch (err) {
      console.error('Error fetching channels:', err);
    }
  };

  const fetchChainChannels = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/chain_channels/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setChainChannels(data || []);
    } catch (err) {
      console.error('Error fetching chain channels:', err);
    }
  };

  const fetchDMGroups = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/dm-groups/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDMGroups(data || []);
    } catch (err) {
      console.error('Error fetching DM groups:', err);
    }
  };

  const fetchUsers = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleAddChannel = async () => {
    if (!newChannel.trim()) return;
    try {
      const token = await AsyncStorage.getItem('access');
      const res = await fetch(`${BACKEND_URL}/api/channels/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newChannel.trim(), workspace: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        setChannels(prev => [...prev, data]);
        setNewChannel('');
        setModalVisible(false);
      }
    } catch (err) {
      console.error('Error adding channel:', err);
    }
  };

  const handleAddDM = async () => {
    if (!selectedUserId) return;
    try {
      const token = await AsyncStorage.getItem('access');
      const res = await fetch(`${BACKEND_URL}/api/dm-groups/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ participants: [selectedUserId] })
      });
      if (res.ok) {
        await fetchDMGroups(token);
        setDMModalVisible(false);
        setSelectedUserId(null);
      }
    } catch (err) {
      console.error('Error creating DM group:', err);
    }
  };

  const filteredChannels = [...channels, ...chainChannels].filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (type) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (type === 'channels') setChannelsOpen(prev => !prev);
    else setDMsOpen(prev => !prev);
  };

  const toggleChannels = () => {
    Animated.timing(channelsChevron, {
      toValue: channelsOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setChannelsOpen(!channelsOpen);
  };

  const toggleDMs = () => {
    Animated.timing(dmsChevron, {
      toValue: dmsOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setDMsOpen(!dmsOpen);
  };

  const toggleActiveStatus = () => {
    setIsUserActive(prev => !prev);
    Alert.alert('Status Updated', `You are now set as ${!isUserActive ? 'active' : 'away'}.`);
  };

  const getOtherUserName = (dmGroup) => {
    if (!dmGroup.participants || !currentUserId) return 'DM';
    // If only one participant, show their name (for 1:1 DMs)
    if (dmGroup.participants.length === 2) {
      const other = dmGroup.participants.find(u => u.id !== currentUserId);
      return other ? other.username : 'DM';
    }
    // For group DMs, show all other usernames except current user
    const others = dmGroup.participants.filter(u => u.id !== currentUserId).map(u => u.username);
    return others.length ? others.join(', ') : 'DM';
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A99E9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerText, { color: theme.text }]}>{workspaceName}</Text>
        <TouchableOpacity onPress={() => setProfileModalVisible(true)} style={{ alignItems: 'center' }}>
          <View>
            <Image source={profileImage || userAvatar} style={styles.avatar} />
            {/* Status Dot */}
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isUserActive ? '#34C759' : '#A3A3A3' }
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Slack-style Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#A3A3A3" style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#A3A3A3"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Channels Section Header */}
      <View style={styles.sectionHeaderContainer}>
        <TouchableOpacity style={styles.sectionHeaderLeft} onPress={toggleChannels} activeOpacity={0.7}>
          <Ionicons name="pricetag-outline" size={20} color="#4A99E9" style={{ marginRight: 8 }} />
          <Text style={styles.sectionHeaderText}>Channels</Text>
          <Animated.View style={{
            transform: [{
              rotate: channelsChevron.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-90deg'],
              }),
            }],
            marginLeft: 6,
          }}>
            <Ionicons name="chevron-down" size={18} color="#A3A3A3" />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addCircleButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Add Channel"
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {channelsOpen && (
        <FlatList
          data={filteredChannels}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => navigation.navigate('Chat', { channel: item })}
            >
              <Ionicons name="pricetag-outline" size={18} color="#4A99E9" />
              <Text style={[styles.channelName, { color: theme.text }]}># {item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Direct Messages Section Header */}
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-outline" size={20} color="#4A99E9" style={{ marginRight: 8 }} />
            <Text style={styles.sectionHeader}>Direct Messages</Text>
          </View>
          <TouchableOpacity
            style={styles.addCircleButton}
            onPress={() => setDMModalVisible(true)}
            accessibilityLabel="Start Direct Message"
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {dmsOpen && (
        <FlatList
          data={dmGroups}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => navigation.navigate('Chat', { dmGroup: item })}
            >
              <Ionicons name="person-circle-outline" size={18} color="#4A99E9" />
              <Text style={[styles.channelName, { color: theme.text }]}>{getOtherUserName(item)}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Channel Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addModalContent}>
            <Text style={styles.addModalTitle}>Add Channel</Text>
            <TextInput
              placeholder="Channel name"
              placeholderTextColor="#A3A3A3"
              value={newChannel}
              onChangeText={setNewChannel}
              style={styles.addModalInput}
              autoFocus
            />
            <View style={styles.addModalButtonRow}>
              <TouchableOpacity
                style={[styles.addModalButton, { backgroundColor: '#4A99E9' }]}
                onPress={handleAddChannel}
              >
                <Text style={styles.addModalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addModalButton, { backgroundColor: '#ececec' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.addModalButtonText, { color: '#232129' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DM Modal */}
      <Modal visible={dmModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.addModalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Start Direct Message</Text>
            <FlatList
              data={users}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedUserId(item.id)}
                  style={{
                    padding: 10,
                    backgroundColor: selectedUserId === item.id ? '#4A99E9' : 'transparent',
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: selectedUserId === item.id ? '#fff' : theme.text }}>
                    {item.username}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddDM}>
                <Text style={styles.addModalButtonText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDMModalVisible(false)}>
                <Text style={[styles.addModalButtonText,{ color:'#232129' }, { backgroundColor: '#ececec' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setProfileModalVisible(false)}>
          <View style={[styles.profileModalContent, { backgroundColor: theme.card }]}>
            <Image source={profileImage || userAvatar} style={styles.profileAvatar} />

            {/* User Name */}
            <Text style={[styles.profileName, { color: theme.text, marginTop: 8 }]}>
              Karthik03
            </Text>

            {/* User Email */}
            <Text style={[styles.profileEmail, { color: '#888', marginBottom: 4, textAlign: 'center' }]}>
              karthik@example.com
            </Text>

            {userStatus ? (
              <View style={styles.profileStatusBadge}>
                <Text style={styles.profileStatusBadgeText}>{userStatus}</Text>
              </View>
            ) : null}

            <View style={styles.profileActionList}>
              <TouchableOpacity
                style={styles.profileActionRow}
                onPress={() => {
                  setProfileModalVisible(false);
                  navigation.navigate('ProfileScreen', {
                    avatar: profileImage || userAvatar,
                    name: userName,
                    email: userEmail,
                    userStatus: userStatus,
                    isUserActive: isUserActive,
                  });
                }}
              >
                <Ionicons name="person-outline" size={20} color={theme.accent} style={styles.profileActionIcon} />
                <Text style={[styles.profileActionText, { color: theme.text }]}>View Profile</Text>
              </TouchableOpacity>
              <View style={styles.profileDivider} />
              <TouchableOpacity
                style={styles.profileActionRow}
                onPress={() => {
                  setProfileModalVisible(false);
                  navigation.navigate('NotificationsScreen');
                }}
              >
                <Ionicons name="notifications-outline" size={20} color="#4A99E9" style={styles.profileActionIcon} />
                <Text style={[styles.profileActionText, { color: theme.text }]}>Notifications</Text>
              </TouchableOpacity>
              <View style={styles.profileDivider} />
              <TouchableOpacity
                style={styles.profileActionRow}
                onPress={() => {
                  setProfileModalVisible(false);
                  navigation.navigate('PreferencesScreen');
                }}
              >
                <Ionicons name="settings-outline" size={20} color="#4A99E9" style={styles.profileActionIcon} />
                <Text style={[styles.profileActionText, { color: theme.text }]}>Preferences</Text>
              </TouchableOpacity>
              <View style={styles.profileDivider} />
              <TouchableOpacity
                style={styles.profileActionRow}
                onPress={() => {
                  setProfileModalVisible(false);
                  setStatusModalVisible(true);
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#4A99E9" style={styles.profileActionIcon} />
                <Text style={[styles.profileActionText, { color: theme.text }]}>Update your status</Text>
              </TouchableOpacity>
              <View style={styles.profileDivider} />
              <TouchableOpacity
                style={styles.profileActionRow}
                onPress={toggleActiveStatus}
              >
                <Ionicons name="ellipse-outline" size={20} color="#4A99E9" style={styles.profileActionIcon} />
                <Text style={[styles.profileActionText, { color: theme.text }]}>
                  Set yourself as {isUserActive ? 'away' : 'active'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setStatusModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Update your status</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
              placeholder="What's your status?"
              placeholderTextColor={theme.placeholder}
              value={userStatus}
              onChangeText={setUserStatus}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                Alert.alert('Status Saved', `Your status: ${userStatus}`);
                setStatusModalVisible(false);
              }}
            >
              <Text style={[styles.addButtonText, { color: '#fff' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 15, borderBottomWidth: 1,
  },
  headerText: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: '#F4F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232129',
    letterSpacing: 0.5,
  },
  channelRow: {
    flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1,
    borderColor: '#eee',
  },
  channelName: { fontSize: 16 },
  dmRow: {
    flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1,
    borderColor: '#eee',
  },
  dmAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  dmName: { fontSize: 16 },
  addButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addCircleButton: {
    backgroundColor: '#4A99E9',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalBox: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    height: 40,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#232129',
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContent: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 32,
    marginTop: 120,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#4A99E9',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  profileAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  profileActionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    backgroundColor: '#232129',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },
  profileStatusBadge: {
    backgroundColor: '#F4F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  profileStatusBadgeText: {
    fontSize: 13,
    color: '#232129',
    fontWeight: '500',
  },
  profileActionList: {
    width: '100%',
    marginTop: 10,
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  profileActionIcon: {
    marginRight: 16,
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#ececec',
    marginLeft: 18 + 20 + 16, // icon size + marginRight + paddingLeft
    marginRight: 0,
  },
  addModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#232129',
  },
  addModalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#232129',
    marginBottom: 18,
    backgroundColor: '#F4F4F6',
  },
  addModalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  addModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});