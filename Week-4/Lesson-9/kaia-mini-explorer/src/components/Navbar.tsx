'use client';

import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { HiSearch } from 'react-icons/hi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNetwork } from '../context/NetworkContext';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { selectedNetwork, setSelectedNetwork, networks } = useNetwork();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      // Check if it's a transaction hash (starts with 0x and is 66 characters long)
      if (query.startsWith('0x') && query.length === 66) {
        router.push(`/transaction/${query}`);
      } else if (!isNaN(Number(query))) {
        // If it's a number, treat it as a block number
        router.push(`/block/${query}`);
      } else {
        // Assume it's an address
        router.push(`/address/${query}`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Clear the search query
      setSearchQuery('');
      
      // Navigate based on the search query
      if (searchQuery.startsWith('0x')) {
        if (searchQuery.length === 42) {
          router.push(`/address/${searchQuery}`);
        } else if (searchQuery.length === 66) {
          router.push(`/tx/${searchQuery}`);
        }
      } else if (!isNaN(Number(searchQuery))) {
        router.push(`/block/${searchQuery}`);
      }
    }
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const network = networks.find(n => n.name === e.target.value);
    if (network) setSelectedNetwork(network);
  };

  return (
    <Box bg="white" px={4} boxShadow="sm">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box 
          cursor="pointer" 
          onClick={() => router.push('/')}
          _hover={{ color: 'blue.500' }}
        >
          <Text fontSize="xl" fontWeight="bold">
            Kaia Mini Explorer
          </Text>
        </Box>
        <Flex alignItems={'center'} gap={4}>
          
          <Flex alignItems={'center'} position="relative">
            <Input
              placeholder="Search by Address / Txn Hash / Block"
              borderRadius="md"
              size="sm"
              maxW="800px"
              w="600px"
              pr="10"
              pl="4"
              py="2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Box 
              position="absolute" 
              right="3" 
              top="50%" 
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={handleSearch}
            >
              <HiSearch size={16} color="gray.500" />
            </Box>
          </Flex>
          <select
            style={{
              width: '150px',
              padding: '0.5rem 0.5rem',
              fontSize: '0.875rem',
              border: '1px solid #E2E8F0',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
            }}
            value={selectedNetwork.name}
            onChange={handleNetworkChange}
          >
            {networks.map((network) => (
              <option key={network.name} value={network.name}>
                {network.name}
              </option>
            ))}
          </select>
        </Flex>
      </Flex>
    </Box>
  );
} 