"use client"

import type React from "react"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { cookieStorage, createStorage, WagmiProvider } from 'wagmi'
import { bsc, mainnet } from "viem/chains"

const metadata = {
  name: 'Normal Swap',
  description: '',
  url: '', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId: "795743f66fae7368f2ba5ebba17ffc10",
  networks: [mainnet, bsc]
})

createAppKit({
  adapters: [wagmiAdapter],
  projectId: "795743f66fae7368f2ba5ebba17ffc10",
  allowUnsupportedChain: false,
  networks: [mainnet, bsc],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    onramp: false,
    email: false, // default to true
    socials: [],
    emailShowWallets: false, // default to true
    swaps: false,
    send: false,
    history: false
  },
  // themeMode: 'dark',
  themeVariables: {
  //   '--w3m-color-mix': '#000413',
  //   '--w3m-color-mix-strength': 10,
  //   '--w3m-accent': '#CFAF60',
    '--w3m-border-radius-master': '2px'
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session to avoid shared state between users
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider reconnectOnMount config={wagmiAdapter.wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  )
}
