import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../context/PreferencesContext';

// Slack mobile supported languages (as of 2024)
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'de', label: 'Deutsch (German)' },
  { code: 'it', label: 'Italiano (Italian)' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'ko', label: '한국어 (Korean)' },
  { code: 'pt-BR', label: 'Português (Brazilian Portuguese)' },
  { code: 'ru', label: 'Русский (Russian)' },
  { code: 'zh-Hans', label: '简体中文 (Simplified Chinese)' },
  { code: 'zh-Hant', label: '繁體中文 (Traditional Chinese)' },
];

// Example time zones (you can expand this list)
const TIME_ZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
  'America/Los_Angeles',
  'UTC',
];

export default function PreferencesScreen({ navigation }) {
  const { isDark, setIsDark, theme } = useTheme();
  const {
    compactMode, setCompactMode,
    underlineLinks, setUnderlineLinks,
    showTypingIndicators, setShowTypingIndicators,
    raiseHand, setRaiseHand,
  } = usePreferences();

  const [languageModal, setLanguageModal] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState(LANGUAGES[0]);

  // Time zone state
  const [autoTimeZone, setAutoTimeZone] = React.useState(true);
  const [timeZoneModal, setTimeZoneModal] = React.useState(false);
  const [selectedTimeZone, setSelectedTimeZone] = React.useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const displayTimeZone = autoTimeZone ? deviceTimeZone : selectedTimeZone;

  // --- FIX: update handler for autoTimeZone switch ---
  const handleAutoTimeZone = (value) => {
    setAutoTimeZone(value);
    if (value) {
      // If turning ON auto, reset selectedTimeZone to device time zone
      setSelectedTimeZone(deviceTimeZone);
    } else {
      // If turning OFF auto, keep current selectedTimeZone or set to device time zone if not set
      if (!selectedTimeZone) setSelectedTimeZone(deviceTimeZone);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerRow, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.text }]}>Preferences</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Appearance</Text>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Dark mode</Text>
            <Switch
              value={isDark}
              onValueChange={setIsDark}
              thumbColor={isDark ? theme.accent : theme.secondaryText}
            />
          </View>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Compact messages</Text>
            <Switch
              value={compactMode}
              onValueChange={setCompactMode}
              thumbColor={compactMode ? theme.accent : theme.secondaryText}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Language</Text>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: theme.card }]}
            onPress={() => setLanguageModal(true)}
          >
            <Text style={[styles.label, { color: theme.text }]}>App language</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: theme.secondaryText, marginRight: 6 }}>
                {selectedLanguage.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Time zone</Text>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Set time zone automatically</Text>
            <Switch
              value={autoTimeZone}
              onValueChange={handleAutoTimeZone}
              thumbColor={autoTimeZone ? theme.accent : theme.secondaryText}
            />
          </View>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: theme.card, opacity: autoTimeZone ? 0.5 : 1 }]}
            onPress={() => !autoTimeZone && setTimeZoneModal(true)}
            disabled={autoTimeZone}
          >
            <Text style={[styles.label, { color: theme.text }]}>Time zone</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: theme.secondaryText, marginRight: 6 }}>
                {displayTimeZone}
              </Text>
              {!autoTimeZone && (
                <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Accessibility</Text>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Underline links</Text>
            <Switch
              value={underlineLinks}
              onValueChange={setUnderlineLinks}
              thumbColor={underlineLinks ? theme.accent : theme.secondaryText}
            />
          </View>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Display typing indicators</Text>
            <Switch
              value={showTypingIndicators}
              onValueChange={setShowTypingIndicators}
              thumbColor={showTypingIndicators ? theme.accent : theme.secondaryText}
            />
          </View>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Raise hand to speak</Text>
            <Switch
              value={raiseHand}
              onValueChange={setRaiseHand}
              thumbColor={raiseHand ? theme.accent : theme.secondaryText}
            />
          </View>
        </View>
      </ScrollView>

      {/* Language Picker Modal */}
      <Modal
        visible={languageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setLanguageModal(false)}
        >
          <View style={{
            backgroundColor: theme.card,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 24,
            width: '100%',
            maxHeight: '60%',
          }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 18 }}>
              Choose app language
            </Text>
            <ScrollView>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  }}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setLanguageModal(false);
                  }}
                >
                  <Text style={{
                    color: theme.text,
                    fontSize: 16,
                    flex: 1,
                  }}>
                    {lang.label}
                  </Text>
                  {selectedLanguage.code === lang.code && (
                    <Ionicons name="checkmark" size={20} color={theme.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Time Zone Picker Modal */}
      <Modal
        visible={timeZoneModal}
        transparent
        animationType="slide"
        onRequestClose={() => setTimeZoneModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setTimeZoneModal(false)}
        >
          <View style={{
            backgroundColor: theme.card,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 24,
            width: '100%',
            maxHeight: '60%',
          }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 18 }}>
              Choose time zone
            </Text>
            <ScrollView>
              {TIME_ZONES.map(tz => (
                <TouchableOpacity
                  key={tz}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  }}
                  onPress={() => {
                    setSelectedTimeZone(tz);
                    setTimeZoneModal(false);
                    // alert('Time zone changed to ' + tz);
                  }}
                >
                  <Text style={{
                    color: theme.text,
                    fontSize: 16,
                    flex: 1,
                  }}>
                    {tz}
                  </Text>
                  {selectedTimeZone === tz && (
                    <Ionicons name="checkmark" size={20} color={theme.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12,
    borderBottomWidth: 1,
  },
  header: { fontWeight: 'bold', fontSize: 22 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: 'bold' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 10, marginBottom: 12,
  },
  label: { fontSize: 16 },
});