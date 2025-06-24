

import { createContext, useContext, useState, ReactNode } from 'react';

type Network = {
  name: string;
  baseUrl: string;
  rpcUrl: string;
};

const networks: Network[] = [
  {
    name: 'Mainnet',
    baseUrl: 'https://mainnet-oapi.kaiascan.io/api/v1',
    rpcUrl: 'https://public-en.node.kaia.io'
  },
  {
    name: 'Kairos',
    baseUrl: 'https://kairos-oapi.kaiascan.io/api/v1',
    rpcUrl: 'https://public-en-kairos.node.kaia.io'
  },
];

type NetworkContextType = {
  selectedNetwork: Network;
  setSelectedNetwork: (network: Network) => void;
  networks: Network[];
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);

  return (
    <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork, networks }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
} 