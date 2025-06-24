# Kaia Mini Explorer

A lightweight blockchain explorer for the Kaia network, built with Next.js and Chakra UI.

## Features

- Real-time blockchain data display
- Account details and transaction history
- Block information and transaction details
- Smart contract interaction support
- Responsive design for all devices

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Chakra UI](https://chakra-ui.com) - Component library
- [@kaiachain/web3js-ext](https://github.com/kaiachain/web3js-ext) - Kaia blockchain interaction
- TypeScript - Type safety

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_KAIASCAN_API_KEY=your_api_key_here
```

## Project Structure

- `/src/pages` - Next.js pages and API routes
- `/src/components` - Reusable React components
- `/src/utils` - Utility functions and API helpers
- `/src/context` - React context providers
- `/src/app` - API route handlers

## API Routes

- `/api/kaia` - Kaia price and market data
- `/api/blocks/[number]` - Block details
- `/api/transactions/[hash]` - Transaction details
- `/api/accounts/[address]` - Account information

## Features

### Home Page
- Kaia price and market data
- Latest block information
- Total supply and volume statistics

### Block Details
- Block number and timestamp
- Transaction count
- Block size and gas used
- Miner information

### Transaction Details
- Transaction hash and status
- Block information
- From/To addresses
- Gas usage and fees
- Transaction type and method

### Account Details
- Account balance
- Transaction history
- Contract information (for SCA)
- Account type and key information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
