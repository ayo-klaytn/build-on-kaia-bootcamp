'use client';

import { Box, Container, Text, Heading, Badge, Flex, SimpleGrid, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useKaiaApi } from '../../utils/api';
import { useParams } from 'next/navigation';
import { useNetwork } from '../../context/NetworkContext';

interface BlockData {
  block_id: number;
  datetime: string;
  hash: string;
  parent_hash: string;
  total_transaction_count: number;
  block_reward: {
    minted: string;
    total_fee: string;
    burnt_fee: string;
  };
  block_size: number;
  block_committee: {
    block_proposer: string;
    validators: string[];
  };
  base_fee_per_gas: string;
}

export default function BlockDetails() {
  const params = useParams();
  const blockNumber = params?.number ? Number(params.number) : 0;
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getBlockDetails } = useKaiaApi();
  const { selectedNetwork } = useNetwork();
  

  useEffect(() => {
    if (!blockNumber) {
      setError('Invalid block number');
      setLoading(false);
      return;
    }

    async function fetchBlockData() {
      try {
        setLoading(true);
        const data = await getBlockDetails(blockNumber);
        setBlockData(data || {});
        setError(null);
      } catch (err) {
        setError('Failed to fetch block details');
        console.error('Error fetching block details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlockData();
  }, [blockNumber, JSON.stringify(blockData), JSON.stringify(selectedNetwork)]);

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

  if (!blockData) {
    return (
      <Box width="100%" minH="100vh" bg="gray.50">
        <Container maxW="100%" px={8}>
          <Text>No block data found</Text>
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
            <Heading size="lg">Block #{blockData.block_id}</Heading>
            <Badge colorScheme="orange" bg="orange.100" color="orange.800" px={2} py={1}>Kaiascan</Badge>
          </Flex>
          <Text color="gray.500">{formatDate(blockData.datetime)}</Text>
        </Box>

        <SimpleGrid columns={[1, 2]} gap={8} mb={8}>
          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Hash</Text>
            <Text fontFamily="mono">{blockData.hash || ""}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Parent Hash</Text>
            <Text fontFamily="mono">{blockData.parent_hash || ""}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Total Transactions</Text>
            <Text>{blockData.total_transaction_count || 0}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Block Size</Text>
            <Text>{blockData.block_size ? (blockData.block_size / 1024).toFixed(2) + " KB" : "0 KB"}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Base Fee</Text>
            <Text>{blockData.base_fee_per_gas ? blockData.base_fee_per_gas + " Gwei" : "0 Gwei"}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Block Rewards</Text>
            <Text>{blockData.block_reward?.minted ? blockData.block_reward.minted + " KAIA" : "0 KAIA"}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Minted</Text>
            <Text>{blockData.block_reward?.minted ? blockData.block_reward.minted + " KAIA" : "0 KAIA"}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Total Fee</Text>
            <Text>{blockData.block_reward?.total_fee ? blockData.block_reward.total_fee + " KAIA" : "0 KAIA"}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Burnt Fee</Text>
            <Text>{blockData.block_reward?.burnt_fee ? blockData.block_reward.burnt_fee + " KAIA" : "0 KAIA"}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Block Proposer</Text>
            <Text fontFamily="mono">{blockData.block_committee?.block_proposer || ""}</Text>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="sm" bg="white">
            <Text fontSize="sm" color="gray.500" mb={2}>Validators {'(' + (blockData?.block_committee?.validators?.length || 0) + ')'}</Text>
            {blockData?.block_committee?.validators?.map((validator: string, index: number) => (
              <Text key={index} fontFamily="mono" mb={1}>{validator || ""}</Text>
            )) || <Text fontFamily="mono">No validators found</Text>}
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
} 