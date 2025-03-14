import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="ticket/[id]"
        options={{
          headerTitle: "Ticket Details",
          presentation: 'card',
          headerShown: true,
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