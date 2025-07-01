// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ChatScreen from './src/screens/ChatScreen';
import AddChannelScreen from './src/screens/AddChannelScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingScreen from './src/screens/SettingScreen';
import MoreScreen from './src/screens/MoreScreen';
import AccountScreen from './src/screens/AccountScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import PreferencesScreen from './src/screens/PreferencesScreen';
import AdvancedScreen from './src/screens/AdvancedScreen';
import AboutScreen from './src/screens/AboutScreen';
import { ThemeProvider } from './src/context/ThemeContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { PreferencesProvider } from './src/context/PreferencesContext';
import HomeScreen from './src/screens/HomeScreen';
import InviteByEmailScreen from './src/screens/InviteByEmailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <PreferencesProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AddChannel" component={AddChannelScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="MoreScreen" component={MoreScreen} />
              <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
              <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AdvancedScreen" component={AdvancedScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="InviteByEmailScreen"
                component={InviteByEmailScreen}
                options={{ title: 'Invite by Email' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PreferencesProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
