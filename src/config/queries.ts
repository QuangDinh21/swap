import { gql } from "@apollo/client";

export const GET_ACTIVE_INCENTIVES = (pool: string) => gql`
  query {
    incentiveInfos(where: {refundAmount: "0", pool: "${pool}",
        startTime_lte: "${Math.floor(new Date().getTime() / 1000)}",
        endTime_gte: "${Math.floor(new Date().getTime() / 1000)}"}) {
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
export const GET_INCENTIVES = (pool: string) => gql`
  query {
    incentiveInfos(where: {refundAmount: "0", pool: "${pool}"}) {
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

export const GET_DEPOSIT_INFOS = (address: string) => gql`
  query {
    depositInfos(where: { owner: "${address}" }) {
      tokenId
    }
  }
`;

export const GET_STAKE_INFOS = (tokenIds: string[], incentiveId: string) => gql`
  query {
    stakeInfos(where: { tokenId_in: [${tokenIds.map(id => `"${id}"`).join(', ')}], incentiveId: "${incentiveId}"}) {
      incentiveId
      tokenId
      liquidity
      staked
      blockTimestamp
    }
  }
`;

export const GET_ALL_STAKE_INFOS = (incentiveId: string) => gql`
  query {
    stakeInfos(where: { incentiveId: "${incentiveId}", staked: true}) {
      incentiveId
      tokenId
      liquidity
    }
  }
`;