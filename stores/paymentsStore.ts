import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Represents a payment method in the system
 */
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'mollie' | 'ideal';
  label: string;
  last_four?: string;
  expiry_date?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  // Card-specific fields
  card_holder?: string;
  billing_address?: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

/**
 * Store interface for managing payment methods
 */
interface PaymentsStore {
  paymentMethods: PaymentMethod[];
  isLoadingPayments: boolean;
  paymentsError: string | null;
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at' | 'is_default'>) => Promise<void>;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
}

// Mock data for local development
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    label: 'Visa',
    last_four: '4242',
    expiry_date: '12/24',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    card_holder: 'Ro O\'Leary',
  },
  {
    id: '2',
    type: 'paypal',
    label: 'PayPal',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Creates and exports the payments store with persistence
 */
export const usePaymentsStore = create<PaymentsStore>()(
  persist(
    (set, get) => ({
      paymentMethods: MOCK_PAYMENT_METHODS,
      isLoadingPayments: false,
      paymentsError: null,

      /**
       * Simulates fetching payment methods
       * In the future, this will be replaced with actual API calls
       */
      fetchPaymentMethods: async () => {
        set({ isLoadingPayments: true, paymentsError: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ paymentMethods: MOCK_PAYMENT_METHODS });
        } catch (error) {
          set({ paymentsError: (error as Error).message });
        } finally {
          set({ isLoadingPayments: false });
        }
      },

      /**
       * Adds a new payment method to the store
       */
      addPaymentMethod: async (method) => {
        set({ isLoadingPayments: true, paymentsError: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newMethod: PaymentMethod = {
            ...method,
            id: Math.random().toString(36).substr(2, 9),
            is_default: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const currentMethods = get().paymentMethods;
          
          // If this is the first payment method, make it default
          if (currentMethods.length === 0) {
            newMethod.is_default = true;
          }
          
          set({ paymentMethods: [...currentMethods, newMethod] });
        } catch (error) {
          set({ paymentsError: (error as Error).message });
        } finally {
          set({ isLoadingPayments: false });
        }
      },

      /**
       * Updates an existing payment method
       */
      updatePaymentMethod: async (id, updates) => {
        set({ isLoadingPayments: true, paymentsError: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          const currentMethods = get().paymentMethods;
          set({
            paymentMethods: currentMethods.map((method) =>
              method.id === id
                ? {
                    ...method,
                    ...updates,
                    updated_at: new Date().toISOString(),
                  }
                : method
            ),
          });
        } catch (error) {
          set({ paymentsError: (error as Error).message });
        } finally {
          set({ isLoadingPayments: false });
        }
      },

      /**
       * Deletes a payment method
       */
      deletePaymentMethod: async (id) => {
        set({ isLoadingPayments: true, paymentsError: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          const currentMethods = get().paymentMethods;
          const methodToDelete = currentMethods.find(m => m.id === id);
          
          // If deleting default method, make the next one default
          if (methodToDelete?.is_default && currentMethods.length > 1) {
            const nextMethod = currentMethods.find(m => m.id !== id);
            if (nextMethod) {
              await get().setDefaultPaymentMethod(nextMethod.id);
            }
          }

          set({
            paymentMethods: currentMethods.filter((method) => method.id !== id),
          });
        } catch (error) {
          set({ paymentsError: (error as Error).message });
        } finally {
          set({ isLoadingPayments: false });
        }
      },

      /**
       * Sets a payment method as default
       */
      setDefaultPaymentMethod: async (id) => {
        set({ isLoadingPayments: true, paymentsError: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          const currentMethods = get().paymentMethods;
          set({
            paymentMethods: currentMethods.map((method) => ({
              ...method,
              is_default: method.id === id,
              updated_at: new Date().toISOString(),
            })),
          });
        } catch (error) {
          set({ paymentsError: (error as Error).message });
        } finally {
          set({ isLoadingPayments: false });
        }
      },
    }),
    {
      name: 'payments-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 