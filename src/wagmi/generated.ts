import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapV3Factory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapV3FactoryAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'fee', type: 'uint24' },
    ],
    name: 'getPool',
    outputs: [{ name: 'pool', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'fee', type: 'uint24' },
    ],
    name: 'createPool',
    outputs: [{ name: 'pool', type: 'address' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapV3Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapV3PoolAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: 'liquidity', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'observationIndex', type: 'uint16' },
      { name: 'observationCardinality', type: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16' },
      { name: 'feeProtocol', type: 'uint8' },
      { name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: 'token0', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: 'token1', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: 'fee', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: 'tickSpacing', type: 'int24' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapV3PositionManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapV3PositionManagerAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: 'totalSupply', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'positions',
    outputs: [
      { name: 'nonce', type: 'uint96' },
      { name: 'operator', type: 'address' },
      { name: 'token0', type: 'address' },
      { name: 'token1', type: 'address' },
      { name: 'fee', type: 'uint24' },
      { name: 'tickLower', type: 'int24' },
      { name: 'tickUpper', type: 'int24' },
      { name: 'liquidity', type: 'uint128' },
      { name: 'feeGrowthInside0LastX128', type: 'uint256' },
      { name: 'feeGrowthInside1LastX128', type: 'uint256' },
      { name: 'tokensOwed0', type: 'uint128' },
      { name: 'tokensOwed1', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'token0', type: 'address' },
          { name: 'token1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickLower', type: 'int24' },
          { name: 'tickUpper', type: 'int24' },
          { name: 'amount0Desired', type: 'uint256' },
          { name: 'amount1Desired', type: 'uint256' },
          { name: 'amount0Min', type: 'uint256' },
          { name: 'amount1Min', type: 'uint256' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
    ],
    name: 'mint',
    outputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'liquidity', type: 'uint128' },
      { name: 'amount0', type: 'uint256' },
      { name: 'amount1', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'amount0Desired', type: 'uint256' },
          { name: 'amount1Desired', type: 'uint256' },
          { name: 'amount0Min', type: 'uint256' },
          { name: 'amount1Min', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
    ],
    name: 'increaseLiquidity',
    outputs: [
      { name: 'liquidity', type: 'uint128' },
      { name: 'amount0', type: 'uint256' },
      { name: 'amount1', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'liquidity', type: 'uint128' },
          { name: 'amount0Min', type: 'uint256' },
          { name: 'amount1Min', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
    ],
    name: 'decreaseLiquidity',
    outputs: [
      { name: 'amount0', type: 'uint256' },
      { name: 'amount1', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'recipient', type: 'address' },
          { name: 'amount0Max', type: 'uint128' },
          { name: 'amount1Max', type: 'uint128' },
        ],
      },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', type: 'uint256' },
      { name: 'amount1', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapV3Staker
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapV3StakerAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'key',
        type: 'tuple',
        components: [
          { name: 'rewardToken', type: 'address' },
          { name: 'pool', type: 'address' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'refundee', type: 'address' },
        ],
      },
      { name: 'reward', type: 'uint256' },
    ],
    name: 'createIncentive',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'key',
        type: 'tuple',
        components: [
          { name: 'rewardToken', type: 'address' },
          { name: 'pool', type: 'address' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'refundee', type: 'address' },
        ],
      },
    ],
    name: 'endIncentive',
    outputs: [{ name: 'refund', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'incentiveId', type: 'bytes32' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'stakeToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'key',
        type: 'tuple',
        components: [
          { name: 'rewardToken', type: 'address' },
          { name: 'pool', type: 'address' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'refundee', type: 'address' },
        ],
      },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'unstakeToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'rewardToken', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amountRequested', type: 'uint256' },
    ],
    name: 'claimReward',
    outputs: [{ name: 'reward', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'rewardToken', type: 'address' },
      { name: 'owner', type: 'address' },
    ],
    name: 'rewards',
    outputs: [{ name: 'reward', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'incentiveId', type: 'bytes32' },
    ],
    name: 'stakes',
    outputs: [
      { name: 'secondsPerLiquidityInsideInitialX128', type: 'uint160' },
      { name: 'liquidity', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'incentiveId', type: 'bytes32' }],
    name: 'incentives',
    outputs: [
      { name: 'totalRewardUnclaimed', type: 'uint256' },
      { name: 'totalSecondsClaimedX128', type: 'uint160' },
      { name: 'numberOfStakes', type: 'uint96' },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__
 */
export const useReadUniswapV3Factory = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3FactoryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__ and `functionName` set to `"getPool"`
 */
export const useReadUniswapV3FactoryGetPool =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3FactoryAbi,
    functionName: 'getPool',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__
 */
export const useWriteUniswapV3Factory = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3FactoryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__ and `functionName` set to `"createPool"`
 */
export const useWriteUniswapV3FactoryCreatePool =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3FactoryAbi,
    functionName: 'createPool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__
 */
export const useSimulateUniswapV3Factory =
  /*#__PURE__*/ createUseSimulateContract({ abi: uniswapV3FactoryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__ and `functionName` set to `"createPool"`
 */
export const useSimulateUniswapV3FactoryCreatePool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3FactoryAbi,
    functionName: 'createPool',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const useReadUniswapV3Pool = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"liquidity"`
 */
export const useReadUniswapV3PoolLiquidity =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3PoolAbi,
    functionName: 'liquidity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"slot0"`
 */
export const useReadUniswapV3PoolSlot0 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'slot0',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token0"`
 */
export const useReadUniswapV3PoolToken0 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token0',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token1"`
 */
export const useReadUniswapV3PoolToken1 = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token1',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"fee"`
 */
export const useReadUniswapV3PoolFee = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'fee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"tickSpacing"`
 */
export const useReadUniswapV3PoolTickSpacing =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3PoolAbi,
    functionName: 'tickSpacing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__
 */
export const useReadUniswapV3PositionManager =
  /*#__PURE__*/ createUseReadContract({ abi: uniswapV3PositionManagerAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadUniswapV3PositionManagerTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadUniswapV3PositionManagerBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const useReadUniswapV3PositionManagerTokenOfOwnerByIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'tokenOfOwnerByIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"positions"`
 */
export const useReadUniswapV3PositionManagerPositions =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'positions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__
 */
export const useWriteUniswapV3PositionManager =
  /*#__PURE__*/ createUseWriteContract({ abi: uniswapV3PositionManagerAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteUniswapV3PositionManagerMint =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const useWriteUniswapV3PositionManagerIncreaseLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'increaseLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const useWriteUniswapV3PositionManagerDecreaseLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'decreaseLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"collect"`
 */
export const useWriteUniswapV3PositionManagerCollect =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'collect',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__
 */
export const useSimulateUniswapV3PositionManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: uniswapV3PositionManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateUniswapV3PositionManagerMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const useSimulateUniswapV3PositionManagerIncreaseLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'increaseLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const useSimulateUniswapV3PositionManagerDecreaseLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'decreaseLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"collect"`
 */
export const useSimulateUniswapV3PositionManagerCollect =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'collect',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__
 */
export const useReadUniswapV3Staker = /*#__PURE__*/ createUseReadContract({
  abi: uniswapV3StakerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"rewards"`
 */
export const useReadUniswapV3StakerRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3StakerAbi,
    functionName: 'rewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"stakes"`
 */
export const useReadUniswapV3StakerStakes = /*#__PURE__*/ createUseReadContract(
  { abi: uniswapV3StakerAbi, functionName: 'stakes' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"incentives"`
 */
export const useReadUniswapV3StakerIncentives =
  /*#__PURE__*/ createUseReadContract({
    abi: uniswapV3StakerAbi,
    functionName: 'incentives',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__
 */
export const useWriteUniswapV3Staker = /*#__PURE__*/ createUseWriteContract({
  abi: uniswapV3StakerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"createIncentive"`
 */
export const useWriteUniswapV3StakerCreateIncentive =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'createIncentive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"endIncentive"`
 */
export const useWriteUniswapV3StakerEndIncentive =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'endIncentive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"stakeToken"`
 */
export const useWriteUniswapV3StakerStakeToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'stakeToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"unstakeToken"`
 */
export const useWriteUniswapV3StakerUnstakeToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'unstakeToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"claimReward"`
 */
export const useWriteUniswapV3StakerClaimReward =
  /*#__PURE__*/ createUseWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'claimReward',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__
 */
export const useSimulateUniswapV3Staker =
  /*#__PURE__*/ createUseSimulateContract({ abi: uniswapV3StakerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"createIncentive"`
 */
export const useSimulateUniswapV3StakerCreateIncentive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'createIncentive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"endIncentive"`
 */
export const useSimulateUniswapV3StakerEndIncentive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'endIncentive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"stakeToken"`
 */
export const useSimulateUniswapV3StakerStakeToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'stakeToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"unstakeToken"`
 */
export const useSimulateUniswapV3StakerUnstakeToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'unstakeToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"claimReward"`
 */
export const useSimulateUniswapV3StakerClaimReward =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'claimReward',
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const readErc20 = /*#__PURE__*/ createReadContract({ abi: erc20Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const readErc20Name = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const writeErc20 = /*#__PURE__*/ createWriteContract({ abi: erc20Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const simulateErc20 = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const watchErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__
 */
export const readUniswapV3Factory = /*#__PURE__*/ createReadContract({
  abi: uniswapV3FactoryAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__ and `functionName` set to `"getPool"`
 */
export const readUniswapV3FactoryGetPool = /*#__PURE__*/ createReadContract({
  abi: uniswapV3FactoryAbi,
  functionName: 'getPool',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__
 */
export const writeUniswapV3Factory = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3FactoryAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__ and `functionName` set to `"createPool"`
 */
export const writeUniswapV3FactoryCreatePool =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3FactoryAbi,
    functionName: 'createPool',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__
 */
export const simulateUniswapV3Factory = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3FactoryAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3FactoryAbi}__ and `functionName` set to `"createPool"`
 */
export const simulateUniswapV3FactoryCreatePool =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3FactoryAbi,
    functionName: 'createPool',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__
 */
export const readUniswapV3Pool = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"liquidity"`
 */
export const readUniswapV3PoolLiquidity = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'liquidity',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"slot0"`
 */
export const readUniswapV3PoolSlot0 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'slot0',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token0"`
 */
export const readUniswapV3PoolToken0 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token0',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"token1"`
 */
export const readUniswapV3PoolToken1 = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'token1',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"fee"`
 */
export const readUniswapV3PoolFee = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'fee',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolAbi}__ and `functionName` set to `"tickSpacing"`
 */
export const readUniswapV3PoolTickSpacing = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PoolAbi,
  functionName: 'tickSpacing',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__
 */
export const readUniswapV3PositionManager = /*#__PURE__*/ createReadContract({
  abi: uniswapV3PositionManagerAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readUniswapV3PositionManagerTotalSupply =
  /*#__PURE__*/ createReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readUniswapV3PositionManagerBalanceOf =
  /*#__PURE__*/ createReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const readUniswapV3PositionManagerTokenOfOwnerByIndex =
  /*#__PURE__*/ createReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'tokenOfOwnerByIndex',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"positions"`
 */
export const readUniswapV3PositionManagerPositions =
  /*#__PURE__*/ createReadContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'positions',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__
 */
export const writeUniswapV3PositionManager = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3PositionManagerAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"mint"`
 */
export const writeUniswapV3PositionManagerMint =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const writeUniswapV3PositionManagerIncreaseLiquidity =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'increaseLiquidity',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const writeUniswapV3PositionManagerDecreaseLiquidity =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'decreaseLiquidity',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"collect"`
 */
export const writeUniswapV3PositionManagerCollect =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'collect',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__
 */
export const simulateUniswapV3PositionManager =
  /*#__PURE__*/ createSimulateContract({ abi: uniswapV3PositionManagerAbi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"mint"`
 */
export const simulateUniswapV3PositionManagerMint =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"increaseLiquidity"`
 */
export const simulateUniswapV3PositionManagerIncreaseLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'increaseLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"decreaseLiquidity"`
 */
export const simulateUniswapV3PositionManagerDecreaseLiquidity =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'decreaseLiquidity',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3PositionManagerAbi}__ and `functionName` set to `"collect"`
 */
export const simulateUniswapV3PositionManagerCollect =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3PositionManagerAbi,
    functionName: 'collect',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__
 */
export const readUniswapV3Staker = /*#__PURE__*/ createReadContract({
  abi: uniswapV3StakerAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"rewards"`
 */
export const readUniswapV3StakerRewards = /*#__PURE__*/ createReadContract({
  abi: uniswapV3StakerAbi,
  functionName: 'rewards',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"stakes"`
 */
export const readUniswapV3StakerStakes = /*#__PURE__*/ createReadContract({
  abi: uniswapV3StakerAbi,
  functionName: 'stakes',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"incentives"`
 */
export const readUniswapV3StakerIncentives = /*#__PURE__*/ createReadContract({
  abi: uniswapV3StakerAbi,
  functionName: 'incentives',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__
 */
export const writeUniswapV3Staker = /*#__PURE__*/ createWriteContract({
  abi: uniswapV3StakerAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"createIncentive"`
 */
export const writeUniswapV3StakerCreateIncentive =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'createIncentive',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"endIncentive"`
 */
export const writeUniswapV3StakerEndIncentive =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'endIncentive',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"stakeToken"`
 */
export const writeUniswapV3StakerStakeToken = /*#__PURE__*/ createWriteContract(
  { abi: uniswapV3StakerAbi, functionName: 'stakeToken' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"unstakeToken"`
 */
export const writeUniswapV3StakerUnstakeToken =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'unstakeToken',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"claimReward"`
 */
export const writeUniswapV3StakerClaimReward =
  /*#__PURE__*/ createWriteContract({
    abi: uniswapV3StakerAbi,
    functionName: 'claimReward',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__
 */
export const simulateUniswapV3Staker = /*#__PURE__*/ createSimulateContract({
  abi: uniswapV3StakerAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"createIncentive"`
 */
export const simulateUniswapV3StakerCreateIncentive =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'createIncentive',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"endIncentive"`
 */
export const simulateUniswapV3StakerEndIncentive =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'endIncentive',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"stakeToken"`
 */
export const simulateUniswapV3StakerStakeToken =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'stakeToken',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"unstakeToken"`
 */
export const simulateUniswapV3StakerUnstakeToken =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'unstakeToken',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uniswapV3StakerAbi}__ and `functionName` set to `"claimReward"`
 */
export const simulateUniswapV3StakerClaimReward =
  /*#__PURE__*/ createSimulateContract({
    abi: uniswapV3StakerAbi,
    functionName: 'claimReward',
  })
