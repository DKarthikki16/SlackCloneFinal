import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  Image, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const contentType = response.headers.get('Content-Type');

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // ✅ Save the tokens using correct key names expected by HomeScreen
      await AsyncStorage.setItem('access', data.access);
      await AsyncStorage.setItem('refresh', data.refresh);

      Alert.alert('Login Success');
      navigation.replace('Main'); // Navigate to Home
    } catch (err) {
      console.error('Login error:', err.message);
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/slack-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Slack Clone</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor={colors.subText}
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.subText}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator color={colors.accent} size="large" />
      ) : (
        <Button title="Login" color={colors.accent} onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>New user? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.surface,
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    color: colors.text,
  },
  link: {
    color: colors.accent,
    marginTop: 10,
  },
});
