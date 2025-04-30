import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useOfflineQueueStore from '../stores/offlineQueueStore';
import NetInfo from '@react-native-community/netinfo';

interface BarcodeScanResult {
  type: string;
  data: string;
}

export default function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hasScanned, setHasScanned] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const offlineQueue = useOfflineQueueStore();

  useEffect(() => {
    // Check initial connection status
    NetInfo.fetch().then(state => {
      setIsOnline(!!(state.isConnected && state.isInternetReachable));
    });

    // Subscribe to network status updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = !!(state.isConnected && state.isInternetReachable);
      setIsOnline(isConnected);
      offlineQueue.setOnlineStatus(isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.message}>We need your permission to scan barcodes</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanResult) => {
    if (hasScanned) return; // Prevent multiple scans
    setHasScanned(true);
    
    try {
      if (!isOnline) {
        // Queue the scan for later processing
        offlineQueue.addOperation({
          type: 'SCAN_QR',
          payload: { type, data },
        });
        
        Alert.alert(
          'Offline Mode',
          'QR code has been saved and will be processed when you\'re back online.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      // Online processing
      // TODO: Implement your actual QR processing logic here
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      alert(`Contact scanned: ${data}`);
      router.back();
    } catch (error) {
      console.error('Error processing QR scan:', error);
      Alert.alert('Error', 'Failed to process QR code. Please try again.');
      setHasScanned(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={styles.closeButton} />
      </View>
      
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You're offline - scans will be queued</Text>
        </View>
      )}
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.instructions}>
              Position the QR code within the frame to scan
            </Text>
          </View>
        </CameraView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  instructions: {
    color: '#fff',
    textAlign: 'center',
    padding: 16,
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBanner: {
    backgroundColor: '#FF3B30',
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
}); 