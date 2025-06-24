"use client";

import { ReactNode } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { NetworkProvider } from "../context/NetworkContext";

interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return (
    <NetworkProvider>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </NetworkProvider>
  );
} 