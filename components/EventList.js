import Constants from 'expo-constants';
import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  View, 
  Image, 
  Text, 
  Button, 
  Platform,
  FlatList, 
} from 'react-native';
import { Appearance } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import * as Notifications from 'expo-notifications';

import Data from '../Data';

const osTheme = Appearance.getColorScheme();

const GET_EVENTS = gql`
  query GetEvents {
    getEvents {
      _id
      title
      date
      hour
      description
      infos
      theme
    }
  }
`;

const EventList = () => {
  
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { loading, data, error } = useQuery(GET_EVENTS);
  console.log(data, loading, error)
  if (loading) return <Text>'Loading...'</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    console.log("Data ===>", data, loading, error)

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log("notif",notification)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [data, notification, expoPushToken, notificationListener.current, responseListener, loading, error]);
  
  

  return (
    <ScrollView style={styles.container}>
      {data && data.getEvents
      
      .map((event => (
        <View key={event._id} style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <View style={styles.contentBox}>
            <Text>{event.title}</Text>
            <View style={styles.subContentBox}>
              <Text style={styles.theme}>{event.theme}</Text>
              <Text style={[osTheme === 'dark' && Platform.OS === 'android' ? styles.dark : styles.light]}>{event.date}</Text>
            </View>
            { event.title? 
            <Button 
              title="TEST"
              onPress={async () => await schedulePushNotification(event.theme, event.title, event.date)}
            />: 'no-event'}
          </View>
        </View>
      )))}
    </ScrollView>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(theme,title,date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${theme} 📬`,
      body: `${title} le ${date} `,
      //sound: 'suuuuu.wav', // <- for Android below 8.0
      data: {
        date: `${date}`
      },
    },
    trigger: {
      seconds: 1,
      //channelId: 'custom', // <- for Android 8.0+, see definition above
    },
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
    
  // if (Platform.OS === 'android') {
  //   Notifications.setNotificationChannelAsync('custom', {
  //     channelId: 'custom',
  //     name: 'Suuuu',
  //     sound: 'suuuuu.wav',
  //     audioAttributes: {
  //       usage: Notifications.AndroidAudioUsage.NOTIFICATION_EVENT,
  //       sound:'suuuuu.wav'
  //     },
  //     importance: Notifications.AndroidImportance.MAX,
  //     //vibrationPattern: [0, 250, 250, 250],
  //     lightColor: '#FF231F7C',
  //   });
  //}
  return token;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#fff',
  },
  eventCard: {
    margin: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    height: 150,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  contentBox : {
    padding: 10,
  },
  subContentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  theme: {
    color: 'orange',
  },
  dark: {
    color: 'white',
  },
  light: {
    color: 'gray',
  }
});

export default EventList;