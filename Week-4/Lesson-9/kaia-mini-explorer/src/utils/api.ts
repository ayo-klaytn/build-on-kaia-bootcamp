import { useNetwork } from "../context/NetworkContext";
import { Web3 } from "@kaiachain/web3js-ext";

export function useKaiaApi() {
  const { selectedNetwork } = useNetwork();

  const getKaiaPrice = async () => {
    const response = await fetch(`/api/kaia?network=${selectedNetwork.baseUrl}`);
    const data = await response.json();
    return {
      price: data.price,
      marketCap: data.marketCap,
      volume24h: data.volume24h,
      totalSupply: data.totalSupply,
    };
  };

  const getLatestBlockNumber = async () => {
    try {
      const web3 = new Web3(selectedNetwork.rpcUrl);
      const blockNumber = await web3.eth.getBlockNumber();
      return blockNumber;
    } catch (error) {
      console.error('Error fetching block number:', error);
      return 0;
    }
  };

  const getBlockDetails = async (blockNumber: number) => {
    try {
      const response = await fetch(`/api/blocks/${blockNumber}?network=${selectedNetwork.baseUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch block details');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching block details:', error);
      throw error;
    }
  };

  const getTransactionDetails = async (hash: string) => {
    try {
      const response = await fetch(`/api/transactions/${hash}?network=${selectedNetwork.baseUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction details');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  };

  const getAccountDetails = async (address: string) => {
    try {
      const response = await fetch(`/api/accounts/${address}?network=${selectedNetwork.baseUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch account details');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching account details:', error);
      throw error;
    }
  };

  return { 
    getKaiaPrice, 
    getLatestBlockNumber, 
    getBlockDetails,
    getTransactionDetails,
    getAccountDetails
  };
}
