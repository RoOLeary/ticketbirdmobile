import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('[SUPABASE] Initializing with:', {
  url: supabaseUrl ? 'URL present' : 'URL missing',
  key: supabaseAnonKey ? 'KEY present' : 'KEY missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[SUPABASE] Missing environment variables!');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('[SUPABASE] Client initialized successfully');

// Test a basic query to confirm connection works
(async () => {
  try {
    console.log('[SUPABASE] Testing connection...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    console.log('[SUPABASE] Connection test result:', { data, error });
  } catch (error) {
    console.error('[SUPABASE] Connection test failed:', error);
  }
})(); 