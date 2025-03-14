import React from 'react';
import { Tabs } from 'expo-router';
import { UserCircle, Calendar, QrCode } from 'lucide-react-native';

export default function EventProfileLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          backgroundColor: '#fff',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Scans',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
          headerTitle: 'Scanned Contacts',
        }}
      />
      <Tabs.Screen
        name="meetings"
        options={{
          title: 'Meetings',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: 'My Meetings',
        }}
      />
    </Tabs>
  );
} 