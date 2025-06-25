// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import TransactionSimulator from '@/components/TransactionSimulator';

export default function Home() {
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
      <TransactionSimulator />
    </div>
  );
}