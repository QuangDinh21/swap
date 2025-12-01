import { defineConfig } from '@wagmi/cli';
import { react, actions } from '@wagmi/cli/plugins';
import erc20Abi from './src/abis/erc20.json';
import uniswapV3FactoryAbi from './src/abis/uniV3Factory.json';
import uniswapV3PoolAbi from './src/abis/uniV3Pool.json';
import uniswapV3PositionManagerAbi from './src/abis/uniV3PositionManager.json';
import uniswapV3StakerAbi from './src/abis/uniV3Staker.json';

export default defineConfig({
  out: 'src/wagmi/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi as any,
    },
    {
      name: 'uniswapV3Factory',
      abi: uniswapV3FactoryAbi as any,
    },
    {
      name: 'uniswapV3Pool',
      abi: uniswapV3PoolAbi as any,
    },
    {
      name: 'uniswapV3PositionManager',
      abi: uniswapV3PositionManagerAbi as any,
    },
    {
      name: 'uniswapV3Staker',
      abi: uniswapV3StakerAbi as any,
    },
  ],
  plugins: [react(), actions()],
});
