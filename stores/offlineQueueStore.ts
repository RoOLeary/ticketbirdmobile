import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import NetInfo from '@react-native-community/netinfo';

interface QueuedOperation {
  id: string;
  type: 'SCAN_QR' | 'OTHER_OPERATION';
  payload: any;
  timestamp: number;
}

interface OfflineQueueState {
  operations: QueuedOperation[];
  isOnline: boolean;
  addOperation: (operation: Omit<QueuedOperation, 'id' | 'timestamp'>) => void;
  removeOperation: (id: string) => void;
  setOnlineStatus: (status: boolean) => void;
  processQueue: () => Promise<void>;
}

const useOfflineQueueStore = create<OfflineQueueState>()(
  persist(
    (set, get) => ({
      operations: [],
      isOnline: true,
      addOperation: (operation) => {
        set((state) => ({
          operations: [...state.operations, {
            ...operation,
            id: Date.now().toString(),
            timestamp: Date.now(),
          }],
        }));
      },
      removeOperation: (id) => {
        set((state) => ({
          operations: state.operations.filter(op => op.id !== id),
        }));
      },
      setOnlineStatus: (status) => set({ isOnline: status }),
      processQueue: async () => {
        const state = get();
        if (!state.isOnline) return;

        const operations = [...state.operations];
        for (const operation of operations) {
          try {
            // Process each operation based on type
            switch (operation.type) {
              case 'SCAN_QR':
                // Implement your QR scanning sync logic here
                await processQRScan(operation.payload);
                break;
              // Add other operation types as needed
            }
            // Remove successful operation from queue
            get().removeOperation(operation.id);
          } catch (error) {
            console.error(`Failed to process operation ${operation.id}:`, error);
            // Optionally: Add retry logic or error handling
          }
        }
      },
    }),
    {
      name: 'offline-queue-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOfflineQueueStore; 