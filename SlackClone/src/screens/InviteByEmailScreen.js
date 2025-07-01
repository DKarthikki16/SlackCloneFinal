import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function InviteByEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendInvite = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }
    Alert.alert('Invite Sent', `Invitation sent to ${email}`);
    setEmail('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite by Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendInvite}>
        <Text style={styles.buttonText}>Send Invite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#232129' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  input: { width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#4A99E9', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});