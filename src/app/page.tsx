// src/app/page.tsx
import TransactionSimulator from '@/components/TransactionSimulator';

export default function Home() {
  return (
    <div className="min-h-screen bg-kaia-gradient">
      <TransactionSimulator />
    </div>
  );
}