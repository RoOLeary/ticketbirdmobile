import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Settings, Bell, CreditCard, Heart, CircleHelp as HelpCircle } from 'lucide-react-native';
import React from 'react';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#fff',
          },
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#666',
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            drawerLabel: 'Notifications',
            drawerIcon: ({ color, size }) => <Bell size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="payments"
          options={{
            drawerLabel: 'Payments',
            drawerIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="favorites"
          options={{
            drawerLabel: 'Favorites',
            drawerIcon: ({ color, size }) => <Heart size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="help"
          options={{
            drawerLabel: 'Help & Support',
            drawerIcon: ({ color, size }) => <HelpCircle size={size} color={color} />,
          }}
        />
      </Drawer>
      <StatusBar style="auto" />
    </>
  );
}