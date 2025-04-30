import NetInfo from '@react-native-community/netinfo';
import useOfflineQueueStore from '../stores/offlineQueueStore';

function App() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offlineQueue = useOfflineQueueStore.getState();
      const isConnected = state.isConnected && state.isInternetReachable;
      
      offlineQueue.setOnlineStatus(!!isConnected);
      
      if (isConnected) {
        // Process queued operations when coming back online
        offlineQueue.processQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  // ... rest of your App component
} 