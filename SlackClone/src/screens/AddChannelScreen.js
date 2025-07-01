import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { ChannelContext } from '../context/ChannelContext';

export default function AddChannelScreen({ navigation }) {
  const [channelName, setChannelName] = useState('');
  const { addChannel } = useContext(ChannelContext);

  const handleCreate = () => {
    if (channelName.trim()) {
      addChannel(channelName.trim());
      navigation.goBack();
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Add New Channel</Text>
      <TextInput
        placeholder="Channel name"
        value={channelName}
        onChangeText={setChannelName}
        style={{ borderWidth: 1, borderColor: '#ccc', marginVertical: 10, padding: 8 }}
      />
      <Button title="Create" onPress={handleCreate} />
    </View>
  );
}
