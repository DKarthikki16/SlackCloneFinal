import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const activityData = [
  {
    id: '1',
    user: 'Gokul',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    action: 'mentioned you',
    channel: '#tech-talk',
    message: 'Check out the new API docs!',
    time: '2m',
  },
  {
    id: '2',
    user: 'Gopi',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    action: 'reacted to your message',
    channel: '#general',
    emoji: '👍',
    message: 'Let’s deploy this!',
    time: '10m',
  },
  {
    id: '3',
    user: 'Priya',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    action: 'invited you',
    channel: '#random',
    message: 'Join the random channel!',
    time: '1h',
  },
  {
    id: '4',
    user: 'Alex',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    action: 'replied to your thread',
    channel: '#help',
    message: 'I have the answer!',
    time: '2h',
  },
];

function ActivityItem({ item }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.activityItem, { backgroundColor: theme.background }]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          <Text style={[styles.user, { color: theme.text }]}>{item.user}</Text>
          <Text style={[styles.action, { color: theme.text }]}>
            {' '}
            {item.action}{' '}
          </Text>
          <Text style={[styles.channel, { color: theme.link }]}>{item.channel}</Text>
          <Text style={[styles.time, { color: theme.subText }]}> · {item.time}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          {item.emoji && <Text style={styles.emoji}>{item.emoji}</Text>}
          <Text style={[styles.message, { color: theme.text }]}>{item.message}</Text>
        </View>
      </View>
    </View>
  );
}

const TABS = [
  { key: 'All', label: 'All' },
  { key: 'Mentions', label: 'Mentions' },
  { key: 'Threads', label: 'Threads' },
  { key: 'Reactions', label: 'Reactions' },
  { key: 'Invitations', label: 'Invitations' },
];

export default function ActivityScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = React.useState('All');

  // Filtering logic
  const filteredData = React.useMemo(() => {
    switch (selectedTab) {
      case 'Mentions':
        return activityData.filter(item => item.action.toLowerCase().includes('mention'));
      case 'Threads':
        return activityData.filter(item => item.action.toLowerCase().includes('thread'));
      case 'Reactions':
        return activityData.filter(item => item.action.toLowerCase().includes('react'));
      case 'Invitations':
        return activityData.filter(item => item.action.toLowerCase().includes('invite'));
      default:
        return activityData;
    }
  }, [selectedTab]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Improved Scrollable Tab Buttons */}
      <View style={styles.tabRowWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                selectedTab === tab.key && {
                  backgroundColor: theme.accent + '22',
                  borderColor: theme.accent,
                  shadowColor: theme.accent,
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 2,
                },
              ]}
              onPress={() => setSelectedTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedTab === tab.key ? theme.accent : theme.secondaryText,
                    fontWeight: selectedTab === tab.key ? 'bold' : '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Text style={[styles.header, { color: theme.text }]}>Mentions & reactions</Text>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityItem item={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ color: theme.secondaryText, textAlign: 'center', marginTop: 40 }}>
            No activity found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 2,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  action: {
    fontSize: 15,
    fontWeight: '400',
  },
  channel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 13,
    marginLeft: 4,
  },
  emoji: {
    fontSize: 18,
    marginRight: 6,
  },
  message: {
    fontSize: 15,
    flexShrink: 1,
  },
  tabRowWrapper: {
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
    minWidth: 90,
  },
  tabText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
