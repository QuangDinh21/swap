import { WalletConnection } from '../WalletConnection';
import { UI_CONFIG } from '../../config/constants';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-white/30 sticky top-0 z-50 shadow-xl shadow-slate-200/30">
        <div className="max-w-7xl mx-auto px-3 py-3 sm:px-4 lg:px-6">
          {/* Main Header Row */}
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* App Title (no logo) */}
            <div className="flex items-center">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {UI_CONFIG.APP_NAME}
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <WalletConnection />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="relative bg-white/50 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-slate-700 font-semibold">
                {UI_CONFIG.APP_NAME}
              </span>
            </div>
            <div className="text-sm text-slate-600" />
          </div>
        </div>
      </footer>
    </div>
  );
}
