import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

export default function ChannelList({ channels, onSelect }) {
  return (
    <ScrollView>
      {channels.map((channel, idx) => (
        <TouchableOpacity key={idx} onPress={() => onSelect(channel)}>
          <Text style={commonStyles.listItem}>#{channel}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
