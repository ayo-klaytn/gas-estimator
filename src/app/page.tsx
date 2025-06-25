// src/app/page.tsx
import dynamic from 'next/dynamic';
import ClientOnly from '@/components/ClientOnly';

const Web3Provider = dynamic(() => import('@/components/Web3Provider'), {
  ssr: false,
});

const TransactionSimulator = dynamic(() => import('@/components/TransactionSimulator'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-kaia-gradient">
      <ClientOnly>
        <Web3Provider>
          <TransactionSimulator />
        </Web3Provider>
      </ClientOnly>
    </div>
  );
}