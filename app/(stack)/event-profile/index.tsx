import { Redirect } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function EventProfileIndex() {
  const { id } = useLocalSearchParams();
  
  // Redirect to the contact tab by default
  return <Redirect href={{ pathname: "/event-profile/contact", params: { id } }} />;
} 