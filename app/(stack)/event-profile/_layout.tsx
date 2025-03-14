import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { UserCircle, Calendar, QrCode, ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity, Text } from 'react-native';

export default function EventProfileLayout() {
  const router = useRouter();

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
          headerLeft: () => (
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#007AFF" />
              <Text style={{ 
                fontSize: 17, 
                fontFamily: 'Inter-Medium', 
                color: '#007AFF', 
                marginLeft: 4 
              }}>
                Back
              </Text>
            </TouchableOpacity>
          ),
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