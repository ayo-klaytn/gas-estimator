// src/app/page.tsx
import dynamic from 'next/dynamic';

// Dynamically import TransactionSimulator with no SSR
const TransactionSimulator = dynamic(
  () => import('@/components/TransactionSimulator'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-kaia-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading Kaia Gas Simulator...</div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-kaia-gradient">
      <TransactionSimulator />
    </div>
  );
}