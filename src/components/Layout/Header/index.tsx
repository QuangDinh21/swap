import { WalletConnection } from './WalletConnection';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { t } = useTranslation();
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <h1 className="text-sm sm:text-xl font-bold text-slate-900">{t('title')}</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <WalletConnection />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};
