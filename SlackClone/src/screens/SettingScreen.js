import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export default function SettingScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.headerRow, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('AccountScreen')}>
          <Text style={[styles.optionText, { color: theme.text }]}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('NotificationsScreen')}>
          <Text style={[styles.optionText, { color: theme.text }]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('PreferencesScreen')}>
          <Text style={[styles.optionText, { color: theme.text }]}>Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('AdvancedScreen')}>
          <Text style={[styles.optionText, { color: theme.text }]}>Advanced</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('AboutScreen')}>
          <Text style={[styles.optionText, { color: theme.text }]}>About</Text>
        </TouchableOpacity>
      </ScrollView>
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
    borderBottomWidth: 1,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  option: {
    padding: 18,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
  },
});