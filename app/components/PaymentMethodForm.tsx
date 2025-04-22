import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { usePaymentsStore, type PaymentMethod } from '@/stores/paymentsStore';
import { CreditCard, X } from 'lucide-react-native';

interface PaymentMethodFormProps {
  onClose: () => void;
  existingMethod?: PaymentMethod;
}

/**
 * Component for adding or editing payment methods
 */
export function PaymentMethodForm({ onClose, existingMethod }: PaymentMethodFormProps) {
  // Form state
  const [cardHolder, setCardHolder] = useState(existingMethod?.card_holder || '');
  const [cardNumber, setCardNumber] = useState(existingMethod?.last_four ? `•••• •••• •••• ${existingMethod.last_four}` : '');
  const [expiryDate, setExpiryDate] = useState(existingMethod?.expiry_date || '');
  const [cvv, setCvv] = useState('');
  const [street, setStreet] = useState(existingMethod?.billing_address?.street || '');
  const [city, setCity] = useState(existingMethod?.billing_address?.city || '');
  const [postalCode, setPostalCode] = useState(existingMethod?.billing_address?.postal_code || '');
  const [country, setCountry] = useState(existingMethod?.billing_address?.country || '');

  // Get store actions
  const { addPaymentMethod, updatePaymentMethod, isLoading } = usePaymentsStore();

  /**
   * Formats a credit card number with spaces
   */
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return text;
    }
  };

  /**
   * Formats expiry date with slash
   */
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  /**
   * Validates the form data
   */
  const validateForm = () => {
    if (!cardHolder.trim()) {
      Alert.alert('Error', 'Please enter the card holder name');
      return false;
    }
    if (!existingMethod && (!cardNumber.trim() || cardNumber.replace(/\s+/g, '').length < 16)) {
      Alert.alert('Error', 'Please enter a valid card number');
      return false;
    }
    if (!expiryDate.trim() || !expiryDate.includes('/')) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!existingMethod && (!cvv.trim() || cvv.length < 3)) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (existingMethod) {
        await updatePaymentMethod(existingMethod.id, {
          card_holder: cardHolder,
          expiry_date: expiryDate,
          billing_address: {
            street,
            city,
            postal_code: postalCode,
            country,
          },
        });
      } else {
        const last_four = cardNumber.replace(/\s+/g, '').slice(-4);
        await addPaymentMethod({
          type: 'card',
          label: 'Credit Card',
          last_four,
          expiry_date: expiryDate,
          card_holder: cardHolder,
          billing_address: {
            street,
            city,
            postal_code: postalCode,
            country,
          },
        });
      }
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save payment method');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {existingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Holder</Text>
            <TextInput
              style={styles.input}
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="Name on card"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <View style={styles.cardNumberInput}>
              <CreditCard size={20} color="#666" style={styles.cardIcon} />
              <TextInput
                style={[styles.input, styles.cardNumberField]}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
                editable={!existingMethod}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            {!existingMethod && (
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Address</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder="Street address"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={styles.input}
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="Postal code"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {existingMethod ? 'Save Changes' : 'Add Card'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 8,
  },
  form: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  cardNumberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardNumberField: {
    flex: 1,
    borderWidth: 0,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
}); 