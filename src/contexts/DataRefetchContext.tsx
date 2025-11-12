import { createContext, useContext, useCallback, useRef } from 'react';

interface DataRefetchContextType {
  registerRefetchStakingData: (refetch: () => void) => void;
  triggerRefetchStakingData: () => void;
}

const DataRefetchContext = createContext<DataRefetchContextType | undefined>(
  undefined
);

export function DataRefetchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const refetchStakingDataRef = useRef<(() => void) | null>(null);

  const registerRefetchStakingData = useCallback((refetch: () => void) => {
    refetchStakingDataRef.current = refetch;
  }, []);

  const triggerRefetchStakingData = useCallback(() => {
    if (refetchStakingDataRef.current) {
      refetchStakingDataRef.current();
    }
  }, []);

  return (
    <DataRefetchContext.Provider
      value={{
        registerRefetchStakingData,
        triggerRefetchStakingData,
      }}
    >
      {children}
    </DataRefetchContext.Provider>
  );
}

export function useDataRefetch() {
  const context = useContext(DataRefetchContext);
  if (context === undefined) {
    throw new Error('useDataRefetch must be used within a DataRefetchProvider');
  }
  return context;
}
