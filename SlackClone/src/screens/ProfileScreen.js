import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useRoute } from '@react-navigation/native';

const defaultProfile = require('../../assets/profile-icon.png');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const route = useRoute();
  const { avatar, name, email, userStatus, isUserActive } = route.params || {};
  const [profileImage, setProfileImage] = useState(defaultProfile);

  // Use the avatar passed from Home:
  // If it's a number (from require), use it directly as the source.
  // If it's a string (a URI), use it in the { uri: ... } format.
  // Otherwise, use the local state profileImage (which starts as the defaultProfile require).
  const displayImageSource = (
    typeof avatar === 'number' ? avatar :
    typeof avatar === 'string' ? { uri: avatar } :
    profileImage
  );

  const handleImagePick = () => {
    Alert.alert('Change Profile Photo', 'Select an option', [
      { text: '📷 Camera', onPress: openCamera },
      { text: '🖼️ Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage({ uri: response.assets[0].uri });
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage({ uri: response.assets[0].uri });
      }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.backButton, { color: theme.text }]}>{'<'} Back</Text>
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={displayImageSource}
            style={[styles.profileImage, { borderColor: theme.accent }]}
          />
          {/* Status Dot */}
          <View style={styles.profileStatusIndicatorContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: isUserActive ? '#34C759' : '#A3A3A3' }
              ]}
            />
          </View>
        </TouchableOpacity>

        <Text style={[styles.name, { color: theme.text }]}>{name || 'Karthik03'}</Text>
        {/* Status Badge */}
        {userStatus ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{userStatus}</Text>
          </View>
        ) : null}
        <Text style={[styles.time, { color: theme.secondaryText }]}>22:20 local time</Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]}>
          <Text style={[styles.buttonText, { color: theme.text }]}>Edit status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]}>
          <Text style={[styles.buttonText, { color: theme.text }]}>Edit profile</Text>
        </TouchableOpacity>

        <View style={styles.contactContainer}>
          <Text style={[styles.contactHeader, { color: theme.secondaryText }]}>Contact information</Text>
          <View style={[styles.contactBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.email, { color: theme.text }]}>{email || 'karthik@example.com'}</Text>
            <Text style={[styles.emailType, { color: theme.secondaryText }]}>intern</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    marginBottom: 12,
  },
  profileStatusIndicatorContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#121212',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#F4F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  statusBadgeText: {
    fontSize: 13,
    color: '#232129',
    fontWeight: '500',
  },
  time: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 6,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  contactContainer: {
    marginTop: 30,
    width: '100%',
  },
  contactHeader: {
    fontSize: 14,
    marginBottom: 8,
  },
  contactBox: {
    padding: 16,
    borderRadius: 10,
  },
  email: {
    fontSize: 16,
  },
  emailType: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default ProfileScreen;
