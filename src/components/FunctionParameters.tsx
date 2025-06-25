// src/components/FunctionParameters.tsx
'use client';

import { ContractFunction } from '@/types';

interface FunctionParametersProps {
  selectedFunction: ContractFunction;
  functionParams: Record<number, string>;
  onParamUpdate: (index: number, value: string) => void;
}

export default function FunctionParameters({
  selectedFunction,
  functionParams,
  onParamUpdate,
}: FunctionParametersProps) {
  if (!selectedFunction.inputs.length) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Function Parameters</h3>
      <div className="space-y-4">
        {selectedFunction.inputs.map((input, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="font-medium text-gray-600 sm:min-w-[120px]">
              {input.name} ({input.type}):
            </span>
            <input
              type="text"
              value={functionParams[index] || ''}
              onChange={(e) => onParamUpdate(index, e.target.value)}
              placeholder={`Enter ${input.type} value`}
              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-kaia-600 focus:ring-2 focus:ring-kaia-100 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}