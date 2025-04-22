import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

interface ContactCodeProps {
  value?: string;
}

export default function ContactCode({ value }: ContactCodeProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

//   console.log(value);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Contact Code</Text>
        <View style={{ width: 40 }} />
      </View> */}
      
      <View style={styles.codeContainer}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={value || "https://ronan-oleary.com"}
            size={280}
            backgroundColor="#fff"
            color="#000"
          />
        </View>
        <Text style={styles.instructions}>
          Show this code to share your contact details
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    color: '#000',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  codeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  qrWrapper: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  instructions: {
    color: '#666',
    textAlign: 'center',
    padding: 16,
    marginTop: 24,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 