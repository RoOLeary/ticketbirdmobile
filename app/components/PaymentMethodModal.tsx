import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { PaymentMethodForm } from './PaymentMethodForm';
import { type PaymentMethod } from '@/stores/paymentsStore';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  existingMethod?: PaymentMethod;
}

export function PaymentMethodModal({
  visible,
  onClose,
  existingMethod,
}: PaymentMethodModalProps) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <PaymentMethodForm onClose={onClose} existingMethod={existingMethod} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 