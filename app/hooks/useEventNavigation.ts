import { useLocalSearchParams, useRouter, usePathname } from 'expo-router';

/**
 * Custom hook for event navigation that ensures back buttons in the event stack
 * only navigate back to the event landing page, not further back in history.
 */
export const useEventNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const id = params.id as string;
  
  const handleBack = () => {
    // Check if we're in a sub-screen of the event stack
    if (pathname.includes('/event-landing/') && pathname !== `/event-landing/${id}`) {
      // Navigate back to the event landing page
      router.push({
        pathname: "/event-landing/[id]",
        params: { id }
      });
    } else {
      // Regular back navigation
      router.back();
    }
  };
  
  return { handleBack };
};

export default useEventNavigation; 