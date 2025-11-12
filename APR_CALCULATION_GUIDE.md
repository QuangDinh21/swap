# APR Calculation Guide for Uniswap V3 Staking

This document provides a clear explanation of how Annual Percentage Rate (APR) is calculated for Uniswap V3 liquidity positions staked in incentive programs.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Formula](#core-formula)
3. [Step-by-Step Calculation](#step-by-step-calculation)
4. [Position Value Calculation](#position-value-calculation)
5. [Complete Examples](#complete-examples)
6. [Edge Cases](#edge-cases)

---

## Overview

APR represents the annualized return rate that liquidity providers earn by staking their Uniswap V3 positions in an incentive program. The calculation compares the total rewards distributed over the incentive period against the total value of all staked positions.

**Key Principle:** APR = (Annual Reward Value / Total Staked Value) × 100%

---

## Core Formula

### Basic APR Formula

```
APR = (Total Reward Value / Incentive Duration in Years) / Total Staked Value × 100%
```

### Expanded Formula

```
APR = (Reward Amount × Reward Token Price × Seconds per Year) / (Incentive Duration in Seconds × Total Staked Value) × 100%
```

### Component Breakdown

| Component              | Description                               | Unit                |
| ---------------------- | ----------------------------------------- | ------------------- |
| **Reward Amount**      | Total tokens allocated for the incentive  | Tokens (e.g., JOCX) |
| **Reward Token Price** | Current USD price of the reward token     | USD per token       |
| **Incentive Duration** | Time period from start to end             | Seconds             |
| **Total Staked Value** | Sum of USD values of all staked positions | USD                 |
| **Seconds per Year**   | 365.25 days × 24 hours × 3600 seconds     | 31,557,600 seconds  |

---

## Step-by-Step Calculation

### Step 1: Calculate Total Reward Value

```
Total Reward Value = Reward Amount × Reward Token Price
```

**Example:**

- Reward Amount: 10,000 JOCX
- JOCX Price: $0.50
- Total Reward Value = 10,000 × $0.50 = **$5,000**

---

### Step 2: Calculate Annualized Reward Value

```
Annualized Reward Value = Total Reward Value × (Seconds per Year / Incentive Duration)
```

**Example:**

- Total Reward Value: $5,000
- Incentive Duration: 30 days = 2,592,000 seconds
- Seconds per Year: 31,557,600 seconds
- Annualized Reward Value = $5,000 × (31,557,600 / 2,592,000) = $5,000 × 12.175 = **$60,875**

---

### Step 3: Calculate Total Staked Value

This is the most complex step for Uniswap V3 due to concentrated liquidity. See [Position Value Calculation](#position-value-calculation) section below.

**Example:**

- Position 1 Value: $1,200
- Position 2 Value: $3,500
- Position 3 Value: $800
- Total Staked Value = $1,200 + $3,500 + $800 = **$5,500**

---

### Step 4: Calculate APR

```
APR = (Annualized Reward Value / Total Staked Value) × 100%
```

**Example:**

- Annualized Reward Value: $60,875
- Total Staked Value: $5,500
- APR = ($60,875 / $5,500) × 100% = **1,106.8%**

---

## Position Value Calculation

### Why Uniswap V3 is Different

Unlike Uniswap V2 where all liquidity is distributed across the entire price range (0 to ∞), Uniswap V3 allows liquidity providers to concentrate their liquidity within specific price ranges. This means:

- **Two positions with identical liquidity values can have vastly different USD values**
- **Position value depends on the current price relative to the position's price range**

### The Problem with Simple Calculations

❌ **INCORRECT (Old Method):**

```
Position Value ≈ Pool TVL × (Position Liquidity / Total Pool Liquidity)
```

This assumes all positions are full-range, which is rarely true for V3.

### Accurate Calculation Method

✅ **CORRECT (New Method using Uniswap V3 SDK):**

```
1. Fetch position details: tickLower, tickUpper, liquidity
2. Get current pool state: sqrtPriceX96, tick
3. Use Uniswap V3 SDK to calculate actual token amounts:
   - amount0 (e.g., JOCX tokens)
   - amount1 (e.g., USDT tokens)
4. Calculate USD value:
   Position Value = (amount0 × token0_price) + (amount1 × token1_price)
```

### Position Value Formula (Mathematical)

For a position with liquidity `L`, tick range `[tickLower, tickUpper]`, and current tick `tickCurrent`:

**Case 1: Current price is below range (tickCurrent < tickLower)**

```
amount0 = L × (√P_upper - √P_lower) / (√P_upper × √P_lower)
amount1 = 0
Position Value = amount0 × price_token0
```

**Case 2: Current price is within range (tickLower ≤ tickCurrent ≤ tickUpper)**

```
amount0 = L × (√P_upper - √P_current) / (√P_upper × √P_current)
amount1 = L × (√P_current - √P_lower)
Position Value = (amount0 × price_token0) + amount1
```

_Note: For JOCX/USDT, token1 is USDT, so amount1 is already in USD_

**Case 3: Current price is above range (tickCurrent > tickUpper)**

```
amount0 = 0
amount1 = L × (√P_upper - √P_lower)
Position Value = amount1
```

Where:

- `√P = sqrt(1.0001^tick)` (square root of price at tick)
- `L` = liquidity value from the position
- Prices are derived from ticks using the formula: `price = 1.0001^tick`

---

## Complete Examples

### Example 1: High APR Scenario

**Incentive Details:**

- Reward: 50,000 JOCX
- JOCX Price: $0.80
- Duration: 14 days (1,209,600 seconds)
- Start: Jan 1, 2024
- End: Jan 15, 2024

**Staked Positions:**

| Position | Tick Range         | Liquidity | Current Price Position | USD Value |
| -------- | ------------------ | --------- | ---------------------- | --------- |
| #1234    | [-887220, -887200] | 1,000,000 | Within range           | $2,500    |
| #5678    | [-887220, -887180] | 2,500,000 | Within range           | $8,200    |
| #9012    | [-887240, -887200] | 800,000   | Below range            | $1,100    |

**Calculation:**

```
Step 1: Total Reward Value
= 50,000 JOCX × $0.80
= $40,000

Step 2: Annualized Reward Value
= $40,000 × (31,557,600 / 1,209,600)
= $40,000 × 26.09
= $1,043,600

Step 3: Total Staked Value
= $2,500 + $8,200 + $1,100
= $11,800

Step 4: APR
= ($1,043,600 / $11,800) × 100%
= 8,844.1%
```

**Result: APR = 8,844.1%** 🚀

---

### Example 2: Moderate APR Scenario

**Incentive Details:**

- Reward: 5,000 JOCX
- JOCX Price: $1.20
- Duration: 90 days (7,776,000 seconds)

**Staked Positions:**

| Position | Tick Range         | Liquidity | USD Value |
| -------- | ------------------ | --------- | --------- |
| #1111    | Full range         | 5,000,000 | $15,000   |
| #2222    | [-887220, -887180] | 3,000,000 | $9,500    |
| #3333    | [-887200, -887160] | 2,000,000 | $6,800    |
| #4444    | [-887240, -887200] | 1,500,000 | $4,200    |

**Calculation:**

```
Step 1: Total Reward Value
= 5,000 JOCX × $1.20
= $6,000

Step 2: Annualized Reward Value
= $6,000 × (31,557,600 / 7,776,000)
= $6,000 × 4.06
= $24,360

Step 3: Total Staked Value
= $15,000 + $9,500 + $6,800 + $4,200
= $35,500

Step 4: APR
= ($24,360 / $35,500) × 100%
= 68.6%
```

**Result: APR = 68.6%** 📈

---

### Example 3: Impact of Position Ranges

This example demonstrates why accurate position value calculation matters.

**Scenario:** Same pool, same liquidity value, different tick ranges

**Pool State:**

- Current Tick: -887200
- Current Price: 1 JOCX = $0.50 USDT
- JOCX Price: $0.50

**Three Positions with Identical Liquidity:**

| Position   | Tick Range         | Liquidity | Description              | Actual USD Value |
| ---------- | ------------------ | --------- | ------------------------ | ---------------- |
| Position A | [-887220, -887180] | 1,000,000 | Wide range (±20 ticks)   | $3,200           |
| Position B | [-887210, -887190] | 1,000,000 | Narrow range (±10 ticks) | $1,600           |
| Position C | [-887205, -887195] | 1,000,000 | Very narrow (±5 ticks)   | $800             |

**Key Insight:**

- All three positions have **identical liquidity values** (1,000,000)
- But they have **vastly different USD values** ($3,200 vs $1,600 vs $800)
- Position A contributes 4× more value than Position C to the total staked value
- This directly impacts APR calculation accuracy

**If we used the old (incorrect) method:**

```
❌ Old Method: Assume all positions have equal value
Total Staked Value = 3 × $1,867 (average) = $5,600

✅ Correct Method: Calculate actual values
Total Staked Value = $3,200 + $1,600 + $800 = $5,600
```

In this case they match, but with real-world positions at different price ranges, the difference can be **50-200% or more**.

---

## Edge Cases

### Case 1: No Staked Positions

```
Total Staked Value = $0
APR = undefined (or displayed as "N/A" or "∞")
```

**Handling:** Display "No stakes yet" or "∞%" in UI

---

### Case 2: Position Out of Range

**Scenario:** Current price moves outside a position's range

```
Position: tickLower = -887220, tickUpper = -887200
Current Tick: -887250 (below range)

Result:
- Position holds only token0 (JOCX)
- No token1 (USDT)
- Value = JOCX_amount × JOCX_price
```

**Impact:** Position value decreases when out of range, increasing APR for remaining in-range positions.

---

### Case 3: Incentive Not Started

```
Current Time < Start Time
APR = calculated normally, but displayed as "Upcoming"
```

---

### Case 4: Incentive Ended

```
Current Time > End Time
APR = historical value (no longer earning)
Display: "Ended - APR was X%"
```

---

### Case 5: Very Short Duration

**Scenario:** 1-day incentive with high rewards

```
Duration: 1 day = 86,400 seconds
Annualization Factor = 31,557,600 / 86,400 = 365.25

Result: APR will be 365× the daily rate
```

**Example:**

- Daily return: 3%
- APR: 3% × 365.25 = **1,095.75%**

---

## Implementation Reference

### Code Location

The APR calculation is implemented in:

```
src/hooks/useIncentiveStakingData.ts
```

### Key Functions

1. **Position Value Calculation:**

   - `src/utils/positionValueCalculator.ts`
   - Uses Uniswap V3 SDK for accurate token amount calculation

2. **Staked Positions Fetching:**

   - `src/hooks/useStakedPositionsValue.ts`
   - Fetches position details from NonfungiblePositionManager contract

3. **APR Calculation:**
   - `src/hooks/useIncentiveStakingData.ts`
   - Combines all data to compute final APR

### Formula in Code

```typescript
// Calculate annualized reward value
const rewardValue = rewardAmount * rewardTokenPrice;
const annualizedRewardValue =
  rewardValue * (SECONDS_PER_YEAR / incentiveDuration);

// Calculate APR
const apr =
  totalStakedValue > 0 ? (annualizedRewardValue / totalStakedValue) * 100 : 0;
```

---

## Summary

### Quick Reference Formula

```
APR = (Reward × Price × 31,557,600) / (Duration × Total Staked Value) × 100%
```

### Key Takeaways

1. ✅ **APR is annualized** - A 30-day incentive's rewards are multiplied by ~12× to show annual rate
2. ✅ **Position values matter** - Accurate V3 position valuation is critical for correct APR
3. ✅ **Tick ranges matter** - Same liquidity ≠ same value in Uniswap V3
4. ✅ **Current price matters** - Position value changes as price moves relative to tick range
5. ✅ **APR is dynamic** - Changes as more positions stake or unstake

### Common Mistakes to Avoid

❌ Using liquidity as a proxy for position value  
❌ Assuming all positions are full-range  
❌ Forgetting to annualize the reward rate  
❌ Not filtering for the correct token pair  
❌ Using pool TVL instead of actual staked value

---

## Additional Resources

- [Uniswap V3 Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
- [Uniswap V3 SDK Documentation](https://docs.uniswap.org/sdk/v3/overview)
- [Understanding Concentrated Liquidity](https://docs.uniswap.org/concepts/protocol/concentrated-liquidity)

---
