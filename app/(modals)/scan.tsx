import React from 'react';
import { Stack } from 'expo-router';
import BarcodeScanner from '../components/BarcodeScanner';

export default function ScanScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
          presentation: 'modal',
        }} 
      />
      <BarcodeScanner />
    </>
  );
} 