import React from 'react';
import { Stack } from 'expo-router';
import ContactCode from '../components/ContactCode';

export default function MyCodeScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Contact Details',
          presentation: 'modal',
        }} 
      />
       <ContactCode
        value="https://ronan-oleary.com"
      />
    </>
  );
} 