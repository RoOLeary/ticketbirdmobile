import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import Constants from 'expo-constants';

export default function DebugScreen() {
  const [testResult, setTestResult] = React.useState<any>(null);
  const [envVars, setEnvVars] = React.useState<any>(null);
  const auth = useAuthStore();
  
  const testSupabase = async () => {
  }
} 