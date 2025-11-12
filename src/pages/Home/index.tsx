import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Tabs, TabItem } from '../../components/ui';
import AddLiquidity from './AddLiquidity';
import ManagePosition from './ManagePosition';
import { Layout } from '@/components/Layout';
import { DataRefetchProvider } from '@/contexts/DataRefetchContext';

export default function Home() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<string>('add-liquidity');

  const tabs: TabItem[] = [
    {
      id: 'add-liquidity' as const,
      label: 'Add Liquidity',
    },
    {
      id: 'manage-position' as const,
      label: 'Manage Position',
    },
  ];

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/25">
                <svg
                  className="w-12 h-12 text-white"
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
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Connect Your Wallet
            </h3>
            <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
              Connect your wallet to start earning rewards by providing
              liquidity to the JOCX/USDT pool
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DataRefetchProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
          {/* Main Content */}
          <main className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="max-w-7xl mx-auto">
                <div className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex justify-center">
                    <Tabs
                      tabs={tabs}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-white/30 shadow-lg"
                    />
                  </div>

                  {/* Tab Content */}
                  <div>
                    {activeTab === 'add-liquidity' && <AddLiquidity />}
                    {activeTab === 'manage-position' && <ManagePosition />}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </DataRefetchProvider>
    </Layout>
  );
}
