// src/components/ClientApp.tsx
'use client';

import { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import TransactionSimulator from './TransactionSimulator';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const customTheme = lightTheme({
  accentColor: '#ffffff',
  accentColorForeground: '#16a085',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

export default function ClientApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-kaia-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading Kaia Gas Simulator...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaia-gradient">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customTheme}>
            <TransactionSimulator />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}