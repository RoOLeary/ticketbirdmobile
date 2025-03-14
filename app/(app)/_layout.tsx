import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Chrome as Home, User, Telescope, Newspaper, Search, Menu, TicketCheck } from 'lucide-react-native';
import SearchDialog from '@/components/SearchDialog';

export default function AppLayout() {
  const navigation = useNavigation();
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ marginLeft: 16 }}
            >
              <Menu size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setSearchVisible(true)}
              style={{ marginRight: 16 }}
            >
              <Search size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
       
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            headerTitle: 'Explore Events',
            tabBarIcon: ({ color, size }) => <Telescope size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'My Tickets',
            headerTitle: 'My Tickets',
            tabBarIcon: ({ color, size }) => <TicketCheck size={size} color={color} />,
          }}
        />
         <Tabs.Screen
          name="feed"
          options={{
            title: 'Feed',
            headerTitle: 'My Feed',
            tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerTitle: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
      <SearchDialog visible={searchVisible} onClose={() => setSearchVisible(false)} />
    </>
  );
}