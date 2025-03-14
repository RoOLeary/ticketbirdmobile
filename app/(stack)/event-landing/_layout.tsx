import React from 'react';
import { Stack } from 'expo-router';

export default function EventLandingLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
        },
        headerBackTitleStyle: {
          fontFamily: 'Inter-Regular',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
        animationDuration: 200,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        presentation: 'card',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 