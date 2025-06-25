// src/components/Results.tsx
'use client';

import { SimulationResult } from '@/types';

interface ResultsProps {
  results: SimulationResult;
}

export default function Results({ results }: ResultsProps) {
  const resultItems = [
    { label: 'Estimated Gas', value: results.gasEstimate },
    { label: 'Gas Price', value: `${results.gasPrice} Gwei` },
    { label: `Estimated Cost (${results.symbol})`, value: `${results.estimatedCostKaia} ${results.symbol}` },
    { label: 'Estimated Cost (USD)', value: `$${results.estimatedCostUSD}` },
  ];

  return (
    <div className="bg-kaia-light text-black p-6 rounded-xl animate-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-semibold mb-4">Gas Estimation Results</h3>
      <div className="space-y-4">
        {resultItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-white/20 last:border-b-0">
            <span className="font-medium opacity-90">{item.label}:</span>
            <span className="font-bold text-lg">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}