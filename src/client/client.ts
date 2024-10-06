import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { sepolia } from 'viem/chains'
 
export const walletClient = createWalletClient({
    chain: sepolia,
    transport: window.ethereum ? custom(window.ethereum) : http(),
})

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
})