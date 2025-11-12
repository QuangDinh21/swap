import JSBI from 'jsbi';
import Decimal from 'decimal.js';

export const renderBalance = (
  amount: string | bigint | number,
  options: {
    decimals?: number;
    significantDigits?: number;
    rounding?: Decimal.Rounding;
  } = {},
): string => {
  const { decimals = 18, significantDigits = 4, rounding = Decimal.ROUND_DOWN } = options;

  const parsedAmount = JSBI.BigInt(amount.toString());

  if (
    !JSBI.greaterThanOrEqual(parsedAmount, JSBI.BigInt(0)) ||
    !JSBI.lessThanOrEqual(
      parsedAmount,
      JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
    )
  ) {
    throw new Error(`${parsedAmount} is not a uint256.`);
  }

  if (!Number.isInteger(significantDigits)) {
    throw new Error(`${significantDigits} is not an integer.`);
  }

  if (significantDigits <= 0) {
    throw new Error(`${significantDigits} is not positive.`);
  }

  const numerator = parsedAmount;
  const denominator = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals));

  const quotient = new Decimal(numerator.toString()).div(denominator.toString());
  const absoluteQuotient = quotient.abs();
  const integerDigits =
    absoluteQuotient.greaterThanOrEqualTo(1)
      ? absoluteQuotient.floor().toFixed(0).length
      : 0;
  const totalSignificantDigits = significantDigits + integerDigits;
  const significantQuotient = quotient.toSignificantDigits(totalSignificantDigits, rounding);
  const decimalPlaces = significantQuotient.decimalPlaces();
  return significantQuotient.toFixed(decimalPlaces ?? 0);
};

export type BigintIsh = JSBI | bigint | string

export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === 'bigint'
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh)
}