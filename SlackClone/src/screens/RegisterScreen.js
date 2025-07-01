// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { colors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Register user
      const registerResponse = await fetch('http://10.0.2.2:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const regData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(regData.detail || 'Registration failed');
      }

      // Step 2: Automatically log in
      const loginResponse = await fetch('http://10.0.2.2:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Login failed after registration');
      }

      // Step 3: Save tokens to AsyncStorage
      await AsyncStorage.setItem('accessToken', loginData.access);
      await AsyncStorage.setItem('refreshToken', loginData.refresh);

      Alert.alert('Success', 'Registered and logged in!');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor={colors.subText}
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.subText}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.subText}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} />
      ) : (
        <Button title="Register" color={colors.accent} onPress={handleRegister} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', padding: 20
  },
  title: { color: colors.text, fontSize: 24, marginBottom: 20 },
  input: {
    backgroundColor: colors.surface,
    width: '100%', padding: 10,
    borderRadius: 8, marginBottom: 15,
    color: colors.text
  },
});
