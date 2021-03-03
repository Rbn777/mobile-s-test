import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppearanceProvider } from 'react-native-appearance';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import Settings from './components/Settings';

import Data from './Data';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <AppearanceProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Evènements') {
                iconName = focused
                  ? 'md-folder-open-sharp'
                  : 'folder-outline'
              } else if (route.name === 'Settings') {
                iconName = focused ? 'ios-settings' : 'ios-settings-outline';
              } else if (route.name === 'Créer évènement') {
                iconName = focused ? 'create' : 'create-outline';
              }
              if (route.name === 'Evènements') {
                <Tab.Screen name="Evènements" component={EventList} options={{ tabBarBadge: Data.length, tabBarBadgeStyle: { backgroundColor: '#FC8948', color: 'white' } }} />
              } else {
                <Tab.Screen name="Evènements" component={EventList} options={{ tabBarBadge: Data.length, tabBarBadgeStyle: { backgroundColor: 'white', color: '#FC8948' } }} />
              }

            // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
            tabBarOptions={{
              activeTintColor: '#FC8948',
              inactiveTintColor: 'gray',
            }}
          >
            
          <Tab.Screen name="Evènements" component={EventList} options={{ tabBarBadge: Data.length, tabBarBadgeStyle: { backgroundColor: '#FC8948', color: 'white' } }} />
          <Tab.Screen name="Créer évènement" component={CreateEvent} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginTop: 70
  },
  textWhite: {
    color: "black",
    marginVertical: 10
  },
  tabContainer: {
    backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: "20%",
    alignItems: "center",
    marginTop: 10,
    height: 40,
  },
});