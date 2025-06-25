// src/app/layout.tsx
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { useEffect, useState } from 'react';

import '@rainbow-me/rainbowkit/styles.css';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Kaia Gas Simulator</title>
        <meta name="description" content="Real-time gas estimation for Kaia blockchain transactions" />
      </head>
      <body className={inter.className}>
        {mounted ? (
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider theme={customTheme}>
                {children}
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        ) : (
          <div className="min-h-screen bg-kaia-gradient flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        )}
      </body>
    </html>
  );
}