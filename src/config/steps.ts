import { Step } from "@/types";

export const usdtSteps: Step[] = [
    {
        label: 'Approve USDT for Swapping',
        description: 'Allow the router to spend USDT for swapping',
        status: 'waiting',
    },
    {
        label: 'Swap USDT to JOCX',
        description: 'Exchange USDT to create balanced pair for liquidity',
        status: 'waiting',
    },
    {
        label: 'Approve USDT, JOCX for Liquidity',
        description: 'Allow position manager to use tokens',
        status: 'waiting',
    },
    {
        label: 'Create Liquidity Position',
        description: 'Mint LP NFT representing your liquidity position',
        status: 'waiting',
    },
    {
        label: 'Stake Position',
        description: 'Stake your LP NFT to start earning rewards',
        status: 'waiting',
    },
];

export const usdcSteps: Step[] = [
    {
        label: 'Approve USDC for Swapping',
        description: 'Allow the router to spend USDC for swapping',
        status: 'waiting',
    },
    {
        label: 'Swap USDC to USDT, JOCX',
        description: 'Exchange USDC to create balanced pair for liquidity',
        status: 'waiting',
    },
    {
        label: 'Approve USDT, JOCX for Liquidity',
        description: 'Allow position manager to use tokens',
        status: 'waiting',
    },
    {
        label: 'Create Liquidity Position',
        description: 'Mint LP NFT representing your liquidity position',
        status: 'waiting',
    },
    {
        label: 'Stake Position',
        description: 'Stake your LP NFT to start earning rewards',
        status: 'waiting',
    },
];

export const ethSteps: Step[] = [
    {
        label: 'Swap ETH to USDT, JOCX',
        description: 'Exchange ETH to create balanced pair for liquidity',
        status: 'waiting',
    },
    {
        label: 'Approve USDT, JOCX for Liquidity',
        description: 'Allow position manager to use tokens',
        status: 'waiting',
    },
    {
        label: 'Create Liquidity Position',
        description: 'Mint LP NFT representing your liquidity position',
        status: 'waiting',
    },
    {
        label: 'Stake Position',
        description: 'Stake your LP NFT to start earning rewards',
        status: 'waiting',
    },
];

export const advancedSteps: Step[] = [
    {
        label: 'Approve USDT for Liquidity',
        description: 'Allow position manager to use tokens',
        status: 'waiting',
    },
    {
        label: 'Approve JOCX for Liquidity',
        description: 'Allow position manager to use tokens',
        status: 'waiting',
    },
    {
        label: 'Create Liquidity Position',
        description: 'Mint LP NFT representing your liquidity position',
        status: 'waiting',
    }
];