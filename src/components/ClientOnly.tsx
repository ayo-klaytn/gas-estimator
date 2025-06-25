// src/components/ClientOnly.tsx
'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-kaia-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading Kaia Gas Simulator...</div>
      </div>
    );
  }

  return <>{children}</>;
}