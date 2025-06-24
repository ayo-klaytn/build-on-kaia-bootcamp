'use client';

import { Box, Container, SimpleGrid, Text, Heading, Badge, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useKaiaApi } from '../utils/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [price, setPrice] = useState<string>('$0.00');
  const [marketCap, setMarketCap] = useState<string>('$0.00');
  const [volume, setVolume] = useState<string>('$0.00');
  const [totalSupply, setTotalSupply] = useState<string>('0');
  const [blockNumber, setBlockNumber] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const { getKaiaPrice, getLatestBlockNumber } = useKaiaApi();

  useEffect(() => {
    async function fetchData() {
      try {
        const [kaiaData, latestBlock] = await Promise.all([
          getKaiaPrice(),
          getLatestBlockNumber()
        ]);
        setPrice(`$${kaiaData.price.toFixed(2)}`);
        setMarketCap(`$${kaiaData.marketCap.toLocaleString()}`);
        setVolume(`$${kaiaData.volume24h.toLocaleString()}`);
        setTotalSupply(kaiaData.totalSupply.toLocaleString());
        setBlockNumber(latestBlock.toLocaleString());
      } catch (error) {
        console.error('Error fetching data:', error);
        setPrice('$0.00');
        setMarketCap('$0.00');
        setVolume('$0.00');
        setTotalSupply('0');
        setBlockNumber('0');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getKaiaPrice, getLatestBlockNumber]);

  return (
    <Container maxW="100%" py={8} px={8}>
      <SimpleGrid columns={[1, 2, 3]} gap={8} width="100%">
        <Box
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          bg="white"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">Kaia Price</Text>
            <Badge colorScheme="orange" bg="orange.100" color="orange.800" px={2} py={1}>Kaiascan</Badge>
          </Flex>
          <Heading size="lg" mt={2}>{price}</Heading>
          {loading && <Text>Loading...</Text>}
        </Box>
        <Box
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          bg="white"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">Market Cap</Text>
            <Badge colorScheme="orange" bg="orange.100" color="orange.800" px={2} py={1}>Kaiascan</Badge>
          </Flex>
          <Heading size="lg" mt={2}>{marketCap}</Heading>
          {loading && <Text>Loading...</Text>}
        </Box>
        <Box
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          bg="white"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">24h Volume</Text>
            <Badge colorScheme="orange" bg="orange.100" color="orange.800" px={2} py={1}>Kaiascan</Badge>
          </Flex>
          <Heading size="lg" mt={2}>{volume}</Heading>
          {loading && <Text>Loading...</Text>}
        </Box>
        <Box
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          bg="white"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">Total Supply</Text>
            <Badge colorScheme="orange" bg="orange.100" color="orange.800" px={2} py={1}>Kaiascan</Badge>
          </Flex>
          <Heading size="lg" mt={2}>{totalSupply}</Heading>
          {loading && <Text>Loading...</Text>}
        </Box>
        <Box
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          bg="white"
          cursor="pointer"
          onClick={() => router.push(`/block/${blockNumber.toString().split(',').join('')}`)}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
          transition="all 0.2s"
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">Latest Block</Text>
            <Badge colorScheme="green" bg="green.100" color="green.800" px={2} py={1}>Kaia SDK</Badge>
          </Flex>
          <Heading size="lg" mt={2}>{blockNumber}</Heading>
          {loading && <Text>Loading...</Text>}
        </Box>
      </SimpleGrid>
    </Container>
  );
}
 