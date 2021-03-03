import React from 'react';
import { StyleSheet, ScrollView, View, Image, Text, Button, Platform } from 'react-native';
import { Appearance } from 'react-native'

import { schedulePushNotification } from '../App';
import Data from '../Data';

const osTheme = Appearance.getColorScheme();

const EventList = () => {
  return (
    <ScrollView style={styles.container}>
      {Data.map((event => (
        <View key={event.id} style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <View style={styles.contentBox}>
            <Text>{event.title}</Text>
            <View style={styles.subContentBox}>
              <Text style={styles.theme}>{event.theme}</Text>
              <Text style={[osTheme === 'dark' && Platform.OS === 'android' ? styles.dark : styles.light]}>{event.date}</Text>
            </View>
            <Button
              title="TEST"
              onPress={() => schedulePushNotification()}
            />
          </View>
        </View>
      )))}
    </ScrollView>
  );
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