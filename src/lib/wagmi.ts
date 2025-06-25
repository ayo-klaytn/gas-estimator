// src/lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { kaia, kairos } from 'viem/chains';

// Kaia chains are exported from viem/chains as klaytn (mainnet) and klaytnBaobab (testnet)
// We can use them directly or create aliases for clarity
export const kaiaMainnet = kaia;
export const kairosTestnet = kairos;

export const config = getDefaultConfig({
  appName: 'Kaia Gas Simulator',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [kaiaMainnet, kairosTestnet],
  ssr: true,
});