import { Token, USDT, USDC, ETH } from '@/config/constants';

interface TokenSelectorItemProps {
  isSelected: boolean;
  token: Token;
  onSelect: (token: Token) => void;
}

const TokenSelectorItem = (props: TokenSelectorItemProps) => {
  const { token, onSelect, isSelected } = props;

  const onClick = () => {
    onSelect(token);
  };

  return (
    <button
      key={token.symbol}
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
        isSelected
          ? 'bg-blue-50 border border-blue-200'
          : 'hover:bg-slate-50 border border-transparent'
      }`}
    >
      <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
      <div className="text-left flex-1">
        <div className="font-medium text-slate-900">{token.symbol}</div>
        <div className="text-xs text-slate-600">{token.description}</div>
      </div>
      {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
    </button>
  );
};

interface TokenSelectorProps {
  selectedToken: Token;
  onSelect: (token: Token) => void;
}

const TokenSelector = (props: TokenSelectorProps) => {
  const { selectedToken, onSelect } = props;

  return (
    <div className="space-y-2 border-t border-slate-200 pt-3">
      {[USDT, USDC, ETH].map((token) => (
        <TokenSelectorItem
          key={token.symbol}
          isSelected={selectedToken.symbol === token.symbol}
          token={token}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default TokenSelector;
