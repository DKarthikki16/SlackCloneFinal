import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  FlatList,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

// Dummy notifications data (replace later with real push notifications data)
const dummyNotifications = [
  { id: '1', sender: 'Alice', content: 'Hi, how are you?', time: '09:30 AM' },
  { id: '2', sender: 'Bob', content: 'Meeting at 10!', time: '09:45 AM' },
  { id: '3', sender: 'Charlie', content: 'Check the new update.', time: '10:00 AM' },
];

export default function NotificationsScreen({ navigation }) {
  const { theme } = useTheme();

  // Push notifications & Do Not Disturb toggles
  const [allNotifications, setAllNotifications] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  // Notification Schedule states (for demonstration – using DateTimePicker)
  const [scheduleStart, setScheduleStart] = useState(new Date());
  const [scheduleEnd, setScheduleEnd] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // 'start' or 'end'

  // onChangeTime handler for DateTimePicker
  const onChangeTime = (event, selectedDate) => {
    if (Platform.OS !== 'ios') setShowPicker(false);
    if (selectedDate) {
      if (pickerTarget === 'start') {
        setScheduleStart(selectedDate);
      } else if (pickerTarget === 'end') {
        setScheduleEnd(selectedDate);
      }
    }
  };

  const showTimePicker = (target) => {
    setPickerTarget(target);
    setShowPicker(true);
  };

  // Based on toggles, use dummy notifications or clear them.
  const displayedNotifications =
    allNotifications && !doNotDisturb ? dummyNotifications : [];

  const renderNotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: theme.card }]}>
      <View style={styles.notificationHeader}>
        <Text style={[styles.notificationSender, { color: theme.text }]}>{item.sender}</Text>
        <Text style={[styles.notificationTime, { color: theme.secondaryText }]}>{item.time}</Text>
      </View>
      <Text style={[styles.notificationContent, { color: theme.text }]}>{item.content}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.headerRow, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Push Notifications</Text>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>All new messages</Text>
            <Switch
              value={allNotifications}
              onValueChange={setAllNotifications}
              thumbColor={allNotifications ? theme.accent : theme.secondaryText}
            />
          </View>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Do Not Disturb</Text>
            <Switch
              value={doNotDisturb}
              onValueChange={setDoNotDisturb}
              thumbColor={doNotDisturb ? theme.accent : theme.secondaryText}
            />
          </View>
        </View>
        {/* New Messages Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>All New Messages</Text>
          {displayedNotifications.length > 0 ? (
            <FlatList
              data={displayedNotifications}
              keyExtractor={(item) => item.id}
              renderItem={renderNotificationItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
              {allNotifications ? "No notifications (Do Not Disturb is on)" : "Push notifications turned off"}
            </Text>
          )}
        </View>
        {/* Notification Schedule Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Notification Schedule</Text>
          <View style={[styles.scheduleRow, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={() => showTimePicker('start')}>
              <Text style={[styles.scheduleLabel, { color: theme.text }]}>
                Start: {scheduleStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            <Ionicons name="time-outline" size={20} color={theme.secondaryText} />
          </View>
          <View style={[styles.scheduleRow, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={() => showTimePicker('end')}>
              <Text style={[styles.scheduleLabel, { color: theme.text }]}>
                End: {scheduleEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            <Ionicons name="time-outline" size={20} color={theme.secondaryText} />
          </View>
        </View>
      </ScrollView>
      {/* Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={pickerTarget === 'start' ? scheduleStart : scheduleEnd}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChangeTime}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 24 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: { fontSize: 16 },
  separator: { height: 8 },
  notificationItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationSender: { fontSize: 16, fontWeight: 'bold' },
  notificationTime: { fontSize: 14 },
  notificationContent: { fontSize: 14 },
  emptyText: { fontSize: 14, textAlign: 'center', marginVertical: 16 },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  scheduleLabel: { fontSize: 16 },
});