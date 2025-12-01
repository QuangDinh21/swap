import { Layout } from '../../components/Layout';
import { useAccount } from 'wagmi';
import IncentivesTable from './IncentivesTable';

const Home = () => {
  const { isConnected } = useAccount();
  return (
    <Layout>
      {!isConnected ? (
        <div className="text-center py-20">
          <div className="mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Connect Your Wallet</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Connect your wallet to access the UniswapV3 Staker admin panel and manage incentives.
          </p>
        </div>
      ) : (
        <IncentivesTable />
      )}
    </Layout>
  );
};

export default Home;
