import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = { context: { apiName: 'uni-v3-staker-subgraph' } } as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: any; output: any };
  BigInt: { input: any; output: any };
  Bytes: { input: any; output: any };
  Int8: { input: any; output: any };
  Timestamp: { input: any; output: any };
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour',
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type DepositInfo = {
  __typename?: 'DepositInfo';
  blockTimestamp: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
  owner: Scalars['Bytes']['output'];
  tokenId: Scalars['BigInt']['output'];
};

export type DepositInfo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DepositInfo_Filter>>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<DepositInfo_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenId?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum DepositInfo_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Owner = 'owner',
  TokenId = 'tokenId',
}

export type IncentiveInfo = {
  __typename?: 'IncentiveInfo';
  blockTimestamp: Scalars['BigInt']['output'];
  endTime: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  pool: Scalars['Bytes']['output'];
  refundAmount: Scalars['BigInt']['output'];
  refundee: Scalars['Bytes']['output'];
  reward: Scalars['BigInt']['output'];
  rewardToken: Scalars['Bytes']['output'];
  startTime: Scalars['BigInt']['output'];
};

export type IncentiveInfo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<IncentiveInfo_Filter>>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTime?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<IncentiveInfo_Filter>>>;
  pool?: InputMaybe<Scalars['Bytes']['input']>;
  pool_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pool_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pool_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pool_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pool_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  refundAmount?: InputMaybe<Scalars['BigInt']['input']>;
  refundAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  refundAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  refundAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  refundAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  refundAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  refundAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  refundAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  refundee?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_contains?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_gt?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_gte?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  refundee_lt?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_lte?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_not?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  refundee_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  reward?: InputMaybe<Scalars['BigInt']['input']>;
  rewardToken?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_contains?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_gt?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_gte?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardToken_lt?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_lte?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_not?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  reward_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reward_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reward_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reward_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reward_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reward_not?: InputMaybe<Scalars['BigInt']['input']>;
  reward_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum IncentiveInfo_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  EndTime = 'endTime',
  Id = 'id',
  Pool = 'pool',
  RefundAmount = 'refundAmount',
  Refundee = 'refundee',
  Reward = 'reward',
  RewardToken = 'rewardToken',
  StartTime = 'startTime',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  depositInfo?: Maybe<DepositInfo>;
  depositInfos: Array<DepositInfo>;
  incentiveInfo?: Maybe<IncentiveInfo>;
  incentiveInfos: Array<IncentiveInfo>;
  rewardClaimed?: Maybe<RewardClaimed>;
  rewardClaimeds: Array<RewardClaimed>;
  stakeInfo?: Maybe<StakeInfo>;
  stakeInfos: Array<StakeInfo>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryDepositInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DepositInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositInfo_Filter>;
};

export type QueryIncentiveInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryIncentiveInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<IncentiveInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<IncentiveInfo_Filter>;
};

export type QueryRewardClaimedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRewardClaimedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardClaimed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardClaimed_Filter>;
};

export type QueryStakeInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakeInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakeInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakeInfo_Filter>;
};

export type RewardClaimed = {
  __typename?: 'RewardClaimed';
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  reward: Scalars['BigInt']['output'];
  to: Scalars['Bytes']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type RewardClaimed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RewardClaimed_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewardClaimed_Filter>>>;
  reward?: InputMaybe<Scalars['BigInt']['input']>;
  reward_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reward_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reward_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reward_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reward_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reward_not?: InputMaybe<Scalars['BigInt']['input']>;
  reward_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_gt?: InputMaybe<Scalars['Bytes']['input']>;
  to_gte?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_lt?: InputMaybe<Scalars['Bytes']['input']>;
  to_lte?: InputMaybe<Scalars['Bytes']['input']>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum RewardClaimed_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Reward = 'reward',
  To = 'to',
  TransactionHash = 'transactionHash',
}

export type StakeInfo = {
  __typename?: 'StakeInfo';
  blockTimestamp: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  incentiveId: Scalars['Bytes']['output'];
  liquidity: Scalars['BigInt']['output'];
  staked: Scalars['Boolean']['output'];
  tokenId: Scalars['BigInt']['output'];
};

export type StakeInfo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StakeInfo_Filter>>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  incentiveId?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  incentiveId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_not?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  incentiveId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  liquidity?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StakeInfo_Filter>>>;
  staked?: InputMaybe<Scalars['Boolean']['input']>;
  staked_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  staked_not?: InputMaybe<Scalars['Boolean']['input']>;
  staked_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  tokenId?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum StakeInfo_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  IncentiveId = 'incentiveId',
  Liquidity = 'liquidity',
  Staked = 'staked',
  TokenId = 'tokenId',
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny',
}

export type ListIncentivesQueryVariables = Exact<{
  pool: Scalars['Bytes']['input'];
  skip: Scalars['Int']['input'];
  first: Scalars['Int']['input'];
  orderBy?: InputMaybe<IncentiveInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type ListIncentivesQuery = {
  __typename?: 'Query';
  incentiveInfos: Array<{
    __typename?: 'IncentiveInfo';
    id: any;
    rewardToken: any;
    pool: any;
    startTime: any;
    endTime: any;
    refundee: any;
    reward: any;
    refundAmount: any;
  }>;
};

export type ListStakesQueryVariables = Exact<{
  incentiveId: Scalars['Bytes']['input'];
  skip: Scalars['Int']['input'];
  first: Scalars['Int']['input'];
}>;

export type ListStakesQuery = {
  __typename?: 'Query';
  stakeInfos: Array<{
    __typename?: 'StakeInfo';
    id: any;
    tokenId: any;
    liquidity: any;
    incentiveId: any;
    staked: boolean;
  }>;
};

export const ListIncentivesDocument = gql`
  query listIncentives(
    $pool: Bytes!
    $skip: Int!
    $first: Int!
    $orderBy: IncentiveInfo_orderBy
    $orderDirection: OrderDirection
  ) {
    incentiveInfos(
      where: { pool: $pool }
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      rewardToken
      pool
      startTime
      endTime
      refundee
      reward
      refundAmount
    }
  }
`;

/**
 * __useListIncentivesQuery__
 *
 * To run a query within a React component, call `useListIncentivesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListIncentivesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListIncentivesQuery({
 *   variables: {
 *      pool: // value for 'pool'
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useListIncentivesQuery(
  baseOptions: Apollo.QueryHookOptions<ListIncentivesQuery, ListIncentivesQueryVariables> &
    ({ variables: ListIncentivesQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListIncentivesQuery, ListIncentivesQueryVariables>(
    ListIncentivesDocument,
    options,
  );
}
export function useListIncentivesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ListIncentivesQuery, ListIncentivesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListIncentivesQuery, ListIncentivesQueryVariables>(
    ListIncentivesDocument,
    options,
  );
}
export function useListIncentivesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ListIncentivesQuery, ListIncentivesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ListIncentivesQuery, ListIncentivesQueryVariables>(
    ListIncentivesDocument,
    options,
  );
}
export type ListIncentivesQueryHookResult = ReturnType<typeof useListIncentivesQuery>;
export type ListIncentivesLazyQueryHookResult = ReturnType<typeof useListIncentivesLazyQuery>;
export type ListIncentivesSuspenseQueryHookResult = ReturnType<
  typeof useListIncentivesSuspenseQuery
>;
export type ListIncentivesQueryResult = Apollo.QueryResult<
  ListIncentivesQuery,
  ListIncentivesQueryVariables
>;
export const ListStakesDocument = gql`
  query listStakes($incentiveId: Bytes!, $skip: Int!, $first: Int!) {
    stakeInfos(where: { incentiveId: $incentiveId, staked: true }, skip: $skip, first: $first) {
      id
      tokenId
      liquidity
      incentiveId
      staked
    }
  }
`;

/**
 * __useListStakesQuery__
 *
 * To run a query within a React component, call `useListStakesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListStakesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListStakesQuery({
 *   variables: {
 *      incentiveId: // value for 'incentiveId'
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useListStakesQuery(
  baseOptions: Apollo.QueryHookOptions<ListStakesQuery, ListStakesQueryVariables> &
    ({ variables: ListStakesQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListStakesQuery, ListStakesQueryVariables>(ListStakesDocument, options);
}
export function useListStakesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ListStakesQuery, ListStakesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListStakesQuery, ListStakesQueryVariables>(
    ListStakesDocument,
    options,
  );
}
export function useListStakesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ListStakesQuery, ListStakesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ListStakesQuery, ListStakesQueryVariables>(
    ListStakesDocument,
    options,
  );
}
export type ListStakesQueryHookResult = ReturnType<typeof useListStakesQuery>;
export type ListStakesLazyQueryHookResult = ReturnType<typeof useListStakesLazyQuery>;
export type ListStakesSuspenseQueryHookResult = ReturnType<typeof useListStakesSuspenseQuery>;
export type ListStakesQueryResult = Apollo.QueryResult<ListStakesQuery, ListStakesQueryVariables>;
