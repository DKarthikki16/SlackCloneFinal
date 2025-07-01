import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[
        styles.headerRow,
        { borderBottomColor: theme.border }
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.text }]}>About</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.appName, { color: theme.text }]}>Slack Clone</Text>
          <Text style={[styles.version, { color: theme.text }]}>Version 1.0.0</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Legal</Text>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: theme.card }]}
            onPress={() => Linking.openURL('https://slack.com/terms-of-service')}
          >
            <Text style={[styles.label, { color: theme.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: theme.card }]}
            onPress={() => Linking.openURL('https://slack.com/privacy-policy')}
          >
            <Text style={[styles.label, { color: theme.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact</Text>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: theme.card }]}
            onPress={() => Linking.openURL('mailto:support@slackclone.com')}
          >
            <Text style={[styles.label, { color: theme.text }]}>Contact Support</Text>
            <Ionicons name="mail-outline" size={20} color="#4A99E9" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  header: { fontWeight: 'bold', fontSize: 22 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  appName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  version: { fontSize: 15, marginBottom: 12 },
  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: 'bold' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 10, marginBottom: 12,
  },
  label: { fontSize: 16 },
});