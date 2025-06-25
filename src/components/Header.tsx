// src/components/Header.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <div className="bg-kaia-gradient text-black p-8 flex justify-between items-center">
      <div className="header-content">
        <h1 className="text-4xl font-light mb-2 text-black">⚡ Transaction Simulator</h1>
        <p className="text-lg opacity-90 text-black">
          Estimate transaction costs for smart contract functions on Kaia
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ConnectButton />
      </div>
    </div>
  );
}