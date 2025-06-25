// src/components/TransactionSimulator.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import * as React from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { Loader2 } from 'lucide-react';

import Header from './Header';
import NetworkSelector from './NetworkSelector';
import ContractForm from './ContractForm';
import FunctionParameters from './FunctionParameters';
import Results from './Results';
import { ContractFunction, SimulationResult } from '@/types';

interface NetworkConfig {
  name: string;
  rpc: string;
  symbol: string;
  chainId: number;
}

export default function TransactionSimulator() {
  const { address } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');
  const [contractAddress, setContractAddress] = useState('');
  const [abi, setAbi] = useState('');
  const [functions, setFunctions] = useState<ContractFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<ContractFunction | null>(null);
  const [functionParams, setFunctionParams] = useState<Record<number, string>>({});
  const [fromAddress, setFromAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [error, setError] = useState('');

  // Move networks inside useMemo to prevent useCallback dependency issues
  const networks = React.useMemo<Record<string, NetworkConfig>>(() => ({
    mainnet: {
      name: 'Kaia Mainnet',
      rpc: process.env.NEXT_PUBLIC_KAIA_MAINNET_RPC || 'https://public-en-cypress.klaytn.net',
      symbol: 'KAIA',
      chainId: 8217,
    },
    testnet: {
      name: 'Kairos Testnet',
      rpc: process.env.NEXT_PUBLIC_KAIROS_TESTNET_RPC || 'https://public-en-baobab.klaytn.net',
      symbol: 'KAIA',
      chainId: 1001,
    },
  }), []);

  const parseABI = useCallback((abiText: string) => {
    try {
      if (!abiText.trim()) {
        setFunctions([]);
        return;
      }

      const parsedAbi = JSON.parse(abiText);
      const contractFunctions = parsedAbi.filter((item: ContractFunction) => 
        item.type === 'function' && 
        item.stateMutability !== 'view' && 
        item.stateMutability !== 'pure'
      );
      
      setFunctions(contractFunctions);
      setError('');
      setSelectedFunction(null);
      setFunctionParams({});
      setResults(null); // Clear previous results
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Invalid ABI JSON: ${errorMessage}`);
      setFunctions([]);
    }
  }, []);

  const handleFunctionSelect = useCallback((func: ContractFunction | null) => {
    setSelectedFunction(func);
    setResults(null); // Clear previous results
    if (func) {
      const params: Record<number, string> = {};
      func.inputs.forEach((_, index) => {
        params[index] = '';
      });
      setFunctionParams(params);
    } else {
      setFunctionParams({});
    }
  }, []);

  const updateParam = useCallback((index: number, value: string) => {
    setFunctionParams(prev => ({
      ...prev,
      [index]: value
    }));
  }, []);

  // Auto-simulation function
  const autoSimulateTransaction = useCallback(async () => {
    // Don't simulate if essential data is missing
    if (!contractAddress || !abi || !selectedFunction) {
      setResults(null);
      return;
    }

    if (!ethers.isAddress(contractAddress)) {
      setError('Invalid contract address');
      return;
    }

    // Check if all required parameters are filled
    const hasAllRequiredParams = selectedFunction.inputs.every((input, index) => {
      const paramValue = functionParams[index];
      return input.optional || (paramValue && paramValue.trim() !== '');
    });

    if (!hasAllRequiredParams) {
      setResults(null); // Clear results if params are incomplete
      return;
    }

    try {
      setLoading(true);
      setError('');

      const provider = new ethers.JsonRpcProvider(networks[selectedNetwork].rpc);
      const parsedAbi = JSON.parse(abi);
      const contract = new ethers.Contract(contractAddress, parsedAbi, provider);

      // Collect function parameters
      const params: unknown[] = [];
      selectedFunction.inputs.forEach((input, index) => {
        const paramValue = functionParams[index];
        if (paramValue && paramValue.trim() !== '') {
          // Basic type conversion
          if (input.type.includes('uint') || input.type.includes('int')) {
            params.push(ethers.getBigInt(paramValue));
          } else if (input.type === 'bool') {
            params.push(paramValue.toLowerCase() === 'true');
          } else {
            params.push(paramValue);
          }
        }
      });

      const from = fromAddress || address || '0x0000000000000000000000000000000000000000';

      // Estimate gas
      const gasEstimate = await contract[selectedFunction.name].estimateGas(...params, {
        from: from
      });

      // Get current gas price
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('25', 'gwei');

      // Calculate costs
      const estimatedCostWei = gasEstimate * gasPrice;
      const estimatedCostKaia = ethers.formatEther(estimatedCostWei);

      // Get KAIA price from Netlify function
      let kaiaPriceUSD = null;
      try {
        const response = await fetch('/api/kaia-price');
        if (response.ok) {
          const data = await response.json();
          if (data.price && data.price > 0) {
            kaiaPriceUSD = data.price;
            console.log(`KAIA price fetched: $${kaiaPriceUSD} from ${data.source}`);
          } else {
            throw new Error('Invalid price data from API');
          }
        } else {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.message}`);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('Failed to fetch KAIA price:', e);
        setError(`Gas estimation completed, but failed to fetch current KAIA price: ${errorMessage}`);
        // Don't calculate USD cost if price fetch fails
      }

      const estimatedCostUSD = kaiaPriceUSD 
        ? (parseFloat(estimatedCostKaia) * kaiaPriceUSD).toFixed(6)
        : 'Price unavailable';

      setResults({
        gasEstimate: gasEstimate.toString(),
        gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
        estimatedCostKaia: parseFloat(estimatedCostKaia).toFixed(8),
        estimatedCostUSD: estimatedCostUSD,
        symbol: networks[selectedNetwork].symbol
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to simulate transaction';
      console.error('Auto-simulation error:', err);
      setError(errorMessage);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [contractAddress, abi, selectedFunction, functionParams, fromAddress, address, selectedNetwork, networks]);

  // Auto-simulate when key dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      autoSimulateTransaction();
    }, 20000); // 20 seconds debounce to avoid too many API calls

    return () => clearTimeout(timeoutId);
  }, [autoSimulateTransaction]);

  // Manual simulation (keep the button for explicit triggering)
  const simulateTransaction = async () => {
    await autoSimulateTransaction();
  };

  return (
    <div className="min-h-screen bg-kaia-gradient">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-b-3xl shadow-2xl">
          <Header />
          
          <div className="p-8 space-y-8">
            <NetworkSelector 
              selectedNetwork={selectedNetwork}
              onNetworkChange={setSelectedNetwork}
            />

            <ContractForm
              contractAddress={contractAddress}
              setContractAddress={setContractAddress}
              abi={abi}
              setAbi={(value) => {
                setAbi(value);
                parseABI(value);
              }}
              functions={functions}
              selectedFunction={selectedFunction}
              onFunctionSelect={handleFunctionSelect}
              fromAddress={fromAddress}
              setFromAddress={setFromAddress}
            />

            {selectedFunction && selectedFunction.inputs.length > 0 && (
              <FunctionParameters
                selectedFunction={selectedFunction}
                functionParams={functionParams}
                onParamUpdate={updateParam}
              />
            )}

            {/* Auto-simulation indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-4 text-kaia-600">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm font-medium">Auto-calculating gas...</span>
              </div>
            )}

            {/* Manual simulation button (optional) */}
            <button
              onClick={simulateTransaction}
              disabled={loading || !contractAddress || !abi || !selectedFunction}
              className="w-full bg-kaia-gradient text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              Re-calculate Gas Estimation
            </button>

            {error && (
              <div className="bg-red-500 text-white p-4 rounded-xl animate-in slide-in-from-bottom-4 duration-300">
                <h3 className="font-semibold mb-2">Error</h3>
                <p>{error}</p>
              </div>
            )}

            {results && <Results results={results} />}
          </div>
        </div>
      </div>
    </div>
  );
}