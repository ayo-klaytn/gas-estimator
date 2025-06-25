// src/lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { klaytn, klaytnBaobab } from 'viem/chains';

export const kaiaMainnet = klaytn;
export const kairosTestnet = klaytnBaobab;

export const config = getDefaultConfig({
  appName: 'Kaia Gas Simulator',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [kaiaMainnet, kairosTestnet],
  ssr: true, // Make sure this is true
});