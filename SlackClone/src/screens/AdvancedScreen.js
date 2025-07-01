import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AdvancedScreen({ navigation }) {
  const { theme } = useTheme();
  const [debugLogging, setDebugLogging] = React.useState(false);

  const handleClearCache = () => {
    // TODO: Add real cache clearing logic
    Alert.alert('Cache cleared!');
  };

  const handleExportLogs = () => {
    // TODO: Add real log export logic
    Alert.alert('Logs exported!');
  };

  const handleNetworkDiagnostics = () => {
    // TODO: Navigate to a diagnostics screen or show a test
    Alert.alert('Network diagnostics started!');
  };

  const handleResetApp = () => {
    // TODO: Add real reset logic
    Alert.alert('App data reset!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerRow, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.accent, fontSize: 18 }}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.text }]}>Advanced</Text>
        <View style={{ width: 40 }} />
      </View>
      <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={handleClearCache}>
        <Text style={[styles.optionText, { color: theme.text }]}>Clear cache</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={handleExportLogs}>
        <Text style={[styles.optionText, { color: theme.text }]}>Export logs</Text>
      </TouchableOpacity>
      <View style={[styles.option, { backgroundColor: theme.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={[styles.optionText, { color: theme.text }]}>Enable debug logging</Text>
        <Switch
          value={debugLogging}
          onValueChange={setDebugLogging}
          thumbColor={debugLogging ? theme.accent : theme.secondaryText}
        />
      </View>
      <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={handleNetworkDiagnostics}>
        <Text style={[styles.optionText, { color: theme.text }]}>Network diagnostics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={handleResetApp}>
        <Text style={[styles.optionText, { color: theme.text, color: 'red' }]}>Reset app data</Text>
      </TouchableOpacity>
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
  header: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  option: {
    padding: 18,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 0,
  },
  optionText: {
    fontSize: 16,
  },
});