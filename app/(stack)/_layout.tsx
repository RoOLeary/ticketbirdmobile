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
    </Stack>
  );
} 