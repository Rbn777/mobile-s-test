import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppearanceProvider } from 'react-native-appearance';
import { ApolloClient, InMemoryCache, gql, useQuery, ApolloProvider } from '@apollo/client';

import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import Settings from './components/Settings';

import Data from './Data';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export const client = new ApolloClient({
  uri: 'https://localhost:7777/graphql',
  cache: new InMemoryCache()
});

export default function App() {
  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
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