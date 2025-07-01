import React from 'react';
import { FlatList, TouchableOpacity, Text, Image, View } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

export default function DMList({ dmGroups, onSelect }) {
  return (
    <FlatList
      data={dmGroups}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
            <Image source={{ uri: item.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <Text style={{ marginLeft: 12 }}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
