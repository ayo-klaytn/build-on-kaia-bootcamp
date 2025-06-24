'use client';

import { Box, Container, Text, Heading, Badge, Flex, SimpleGrid, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useKaiaApi } from '../../utils/api';
import { useParams } from 'next/navigation';
import { useNetwork } from '../../context/NetworkContext';

interface AccountKey {
  type: string;
}

interface Contract {
  contract_address: string;
  contract_type: string;
}

interface AccountData {
  address: string;
  account_type: string;
  balance: string;
  total_transaction_count: number;
  account_key?: AccountKey;
  contract?: Contract;
  contract_creator_address?: string;
  contract_creator_transaction_hash?: string;
}

export default function AddressDetails() {
  const params = useParams();
  const address = params?.address as string;
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccountDetails } = useKaiaApi();
  const { selectedNetwork } = useNetwork();

  useEffect(() => {
    if (!address) {
      setError('Invalid address');
      setLoading(false);
      return;
    }

    async function fetchAccountData() {
      try {
        setLoading(true);
        const data = await getAccountDetails(address);
        setAccountData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch account details');
        console.error('Error fetching account details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccountData();
  }, [address, JSON.stringify(accountData), JSON.stringify(selectedNetwork) ]);

  if (loading) {
    return (
      <Box width="100%" minH="100vh" bg="gray.50">
        <Container maxW="100%" px={8}>
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width="100%" minH="100vh" bg="gray.50">
        <Container maxW="100%" px={8}>
          <Text color="red.500">{error}</Text>
        </Container>
      </Box>
    );
  }

  if (!accountData) {
    return (
      <Box width="100%" minH="100vh" bg="gray.50">
        <Container maxW="100%" px={8}>
          <Text>No account data found</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box width="100%" minH="100vh" bg="gray.50">
      <Container maxW="100%" px={8}>
        <Box mb={8} pt={8}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg">Account Details</Heading>
            <Badge colorScheme="green" bg="green.100" color="green.800" px={2} py={1}>Kaiascan</Badge>
          </Flex>
          <Text fontFamily="mono" color="gray.500">{accountData.address}</Text>
        </Box>

        <SimpleGrid columns={[1, 2]} gap={8} mb={8}>
          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Account Type</Text>
            <Text>{accountData.account_type}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Balance</Text>
            <Text>{accountData.balance} KAIA</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Total Transactions</Text>
            <Text>{accountData.total_transaction_count}</Text>
          </Box>

          {accountData.account_type === 'EOA' && (
            <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
              <Text fontSize="sm" color="gray.500" mb={2}>Account Key Type</Text>
              <Text>{accountData.account_key?.type || ""}</Text>
            </Box>
          )}

          {accountData.account_type === 'SCA' && (
            <>
              <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
                <Text fontSize="sm" color="gray.500" mb={2}>Contract Type</Text>
                <Text>{accountData.contract?.contract_type || ""}</Text>
              </Box>

              <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
                <Text fontSize="sm" color="gray.500" mb={2}>Contract Creator</Text>
                <Text fontFamily="mono">{accountData.contract_creator_address || ""}</Text>
              </Box>

              <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
                <Text fontSize="sm" color="gray.500" mb={2}>Creation Transaction</Text>
                <Text fontFamily="mono">{accountData.contract_creator_transaction_hash || ""}</Text>
              </Box>
            </>
          )}
        </SimpleGrid>
      </Container>
    </Box>
  );
} 