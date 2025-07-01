import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext'; // <-- Add this

export default function AccountScreen({ navigation }) {
  const { theme } = useTheme();
  const { profileImage } = useProfile(); // <-- Use shared profile image

  // Dummy user data; replace with real user data as needed
  const user = {
    name: 'Karthik_MD student',
    email: 'karthikd062004@gmail.com',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.text }]}>Account</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image source={profileImage} style={styles.avatar} />
        <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
        <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>
      </View>

      {/* Account Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={[styles.actionItem, { backgroundColor: theme.card }]}>
          <Ionicons name="person-circle-outline" size={22} color={theme.accent} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionItem, { backgroundColor: theme.card }]}>
          <Ionicons name="mail-outline" size={22} color="#4A99E9" style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: theme.text }]}>Change Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionItem, { backgroundColor: theme.card }]}>
          <Ionicons name="key-outline" size={22} color="#4A99E9" style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: theme.text }]}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionItem, { marginTop: 24 }]} onPress={() => navigation.replace('Login')}>
          <Ionicons name="log-out-outline" size={22} color="#E53935" style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: '#E53935' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#18171C',
    borderBottomWidth: 1,
    borderBottomColor: '#232129',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4A99E9',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    marginBottom: 4,
  },
  actionsSection: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});