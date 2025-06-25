// src/types/index.ts
export interface ContractFunction {
  name: string;
  type: string;
  stateMutability: string;
  inputs: Array<{
    name: string;
    type: string;
    optional?: boolean;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
  }>;
}

export interface SimulationResult {
  gasEstimate: string;
  gasPrice: string;
  estimatedCostKaia: string;
  estimatedCostUSD: string;
  symbol: string;
}

export interface NetworkConfig {
  name: string;
  rpc: string;
  symbol: string;
  chainId: number;
}