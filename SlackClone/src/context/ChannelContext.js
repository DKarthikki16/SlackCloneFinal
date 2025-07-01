import React, { createContext, useState } from 'react';

export const ChannelContext = createContext();

export function ChannelProvider({ children }) {
  const [channels, setChannels] = useState([
    { id: '1', name: 'general' },
    { id: '2', name: 'random' },
  ]);
  // Store messages as { [channelId]: [messages] }
  const [messages, setMessages] = useState({
    '1': [], // general
    '2': [], // random
  });

  const addChannel = (name) => {
    const id = Date.now().toString();
    setChannels((prev) => [...prev, { id, name }]);
    setMessages((prev) => ({ ...prev, [id]: [] }));
  };

  const sendMessage = (channelId, message) => {
    setMessages((prev) => ({
      ...prev,
      [channelId]: [
        {
          id: Date.now().toString(),
          text: message.text,
          createdAt: new Date(),
          user: message.user,
        },
        ...(prev[channelId] || []),
      ],
    }));
  };

  return (
    <ChannelContext.Provider value={{ channels, addChannel, messages, sendMessage }}>
      {children}
    </ChannelContext.Provider>
  );
}

// Example usage in a component (move this to your component file, not in the context file)
function handlePress(item, navigation) {
  navigation.navigate('ChatScreen', { channel: item });
}

// In your component JSX:
// <TouchableOpacity onPress={() => handlePress(item, navigation)} />