import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function MoreScreen({ navigation }) {
  const { theme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => navigation.replace('Login'), // Replace to clear stack
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('ProfileScreen')}>
        <Text style={[styles.optionText, { color: theme.text }]} className="text-white text-lg p-4">
          Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('SettingScreen')}>
        <Text style={[styles.optionText, { color: theme.text }]}>
          Settings
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: '#E53935' }]}
        onPress={handleLogout}>
        <Text style={styles.optionText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
  },
});
