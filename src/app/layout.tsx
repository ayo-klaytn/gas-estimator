// src/app/layout.tsx
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';

import '@rainbow-me/rainbowkit/styles.css';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

// Custom green theme for RainbowKit
const customTheme = lightTheme({
  accentColor: 'green',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={customTheme}>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}