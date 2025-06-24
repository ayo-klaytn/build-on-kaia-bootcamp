'use client';

import { Box, Container, Text, Heading, Badge, Flex, SimpleGrid, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useKaiaApi } from '../../utils/api';
import { useParams } from 'next/navigation';
import { useNetwork } from '../../context/NetworkContext';

interface TransactionData {
  hash: string;
  block_id: number;
  datetime: string;
  from: string;
  to: string;
  value: string;
  fee: string;
  status: { status: string};
  type: string;
  input: string;
  gas_price: string;
  gas_limit: string;
  gas_used: string;
  nonce: number;
  title?: string;
  message?: string;
  code?: string;
}

export default function TransactionDetails() {
  const params = useParams();
  const hash = params?.hash as string;
  const [txData, setTxData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getTransactionDetails } = useKaiaApi();
  const { selectedNetwork } = useNetwork();

  useEffect(() => {
    if (!hash) {
      setError('Invalid transaction hash');
      setLoading(false);
      return;
    }

    async function fetchTransactionData() {
      try {
        setLoading(true);
        const data = await getTransactionDetails(hash);
        console.log(data);
        setTxData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch transaction details');
        console.error('Error fetching transaction details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactionData();
  }, [hash, JSON.stringify(txData), JSON.stringify(selectedNetwork)]);

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

  if (!txData || txData.code === 'NOT_FOUND_TRANSACTION') {
    return (
      <Box width="100%" minH="100vh" bg="gray.50">
        <Container maxW="100%" px={8}>
          <Box mb={8} pt={8}>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="lg">Transaction Details</Heading>
              <Badge colorScheme="orange" bg="orange.100" color="orange.800" px={2} py={1}>Kaiascan</Badge>
            </Flex>
            <Box 
              mt={8} 
              p={8} 
              borderRadius="lg" 
              bg="white" 
              boxShadow="sm"
              textAlign="center"
            >
              <Box 
                mb={4} 
                p={4} 
                display="inline-block"
              >
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                    stroke="#E53E3E" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M12 8V12" 
                    stroke="#E53E3E" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M12 16H12.01" 
                    stroke="#E53E3E" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Heading size="md" color="gray.700" mb={2}>
                Transaction Not Found
              </Heading>
              <Text color="gray.500" mb={4}>
                The transaction you're looking for doesn't exist or hasn't been processed yet.
              </Text>
              <Text fontFamily="mono" color="gray.400" fontSize="sm">
                Hash: {hash}
              </Text>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box width="100%" minH="100vh" bg="gray.50">
      <Container maxW="100%" px={8}>
        <Box mb={8} pt={8}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg">Transaction Details</Heading>
            <Badge colorScheme="orange" bg="orange.100" color="orange.800" px={2} py={1}>Kaiascan</Badge>
          </Flex>
          <Text fontFamily="mono" color="gray.500">{txData.hash}</Text>
        </Box>

        <SimpleGrid columns={[1, 2]} gap={8} mb={8}>
          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Block Number</Text>
            <Text>{txData.block_id}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Timestamp</Text>
            <Text>{formatDate(txData.datetime)}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>From</Text>
            <Text fontFamily="mono">{txData.from}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>To</Text>
            <Text fontFamily="mono">{txData.to}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Value</Text>
            <Text>{txData.value} KAIA</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Fee</Text>
            <Text>{txData.fee} KAIA</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Status</Text>
            <Text>{txData?.status?.status || ""}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Type</Text>
            <Text>{txData.type}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Gas Price</Text>
            <Text>{txData.gas_price} Gwei</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Gas Limit</Text>
            <Text>{txData.gas_limit}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Gas Used</Text>
            <Text>{txData.gas_used}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Nonce</Text>
            <Text>{txData.nonce}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Input Data</Text>
            <Text fontFamily="mono" wordBreak="break-all">{txData.input || "0x"}</Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
} 