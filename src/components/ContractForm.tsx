// src/components/ContractForm.tsx
'use client';

import { ContractFunction } from '@/types';

interface ContractFormProps {
  contractAddress: string;
  setContractAddress: (address: string) => void;
  abi: string;
  setAbi: (abi: string) => void;
  functions: ContractFunction[];
  selectedFunction: ContractFunction | null;
  onFunctionSelect: (func: ContractFunction | null) => void;
  fromAddress: string;
  setFromAddress: (address: string) => void;
}

export default function ContractForm({
  contractAddress,
  setContractAddress,
  abi,
  setAbi,
  functions,
  selectedFunction,
  onFunctionSelect,
  fromAddress,
  setFromAddress,
}: ContractFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contract Address
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kaia-600 focus:ring-4 focus:ring-kaia-100 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            From Address (optional)
          </label>
          <input
            type="text"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            placeholder="0x... (defaults to zero address)"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kaia-600 focus:ring-4 focus:ring-kaia-100 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Contract ABI
        </label>
        <textarea
          value={abi}
          onChange={(e) => setAbi(e.target.value)}
          placeholder="Paste your contract ABI JSON here..."
          rows={6}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kaia-600 focus:ring-4 focus:ring-kaia-100 transition-all font-mono text-sm resize-vertical"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Function
        </label>
        <select
          value={selectedFunction ? functions.indexOf(selectedFunction) : ''}
          onChange={(e) => {
            const index = e.target.value;
            onFunctionSelect(index ? functions[parseInt(index)] : null);
          }}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kaia-600 focus:ring-4 focus:ring-kaia-100 transition-all"
        >
          <option value="">
            {functions.length > 0 ? 'Select a function' : 'First, enter contract ABI'}
          </option>
          {functions.map((func, index) => (
            <option key={index} value={index}>
              {func.name}({func.inputs.map(i => `${i.type} ${i.name}`).join(', ')})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}