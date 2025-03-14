import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function StackLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="ticket/[id]"
        options={{
          headerTitle: "Ticket Details",
          presentation: 'card',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/')}
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}
            >
              <ChevronLeft size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 17, marginLeft: 4 }}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="event-landing"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="event-profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="speaker"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="attendee"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 