// src/components/NetworkSelector.tsx
'use client';

interface NetworkSelectorProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

export default function NetworkSelector({ 
  selectedNetwork, 
  onNetworkChange 
}: NetworkSelectorProps) {
  const networks = [
    { id: 'mainnet', name: 'Kaia Mainnet' },
    { id: 'testnet', name: 'Kairos Testnet' },
  ];

  return (
    <div className="flex gap-4 mb-6">
      {networks.map((network) => (
        <button
          key={network.id}
          onClick={() => onNetworkChange(network.id)}
          className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
            selectedNetwork === network.id
              ? 'bg-kaia-600 text-white border-kaia-600'
              : 'bg-white border-gray-200 hover:border-kaia-600'
          }`}
        >
          {network.name}
        </button>
      ))}
    </div>
  );
}