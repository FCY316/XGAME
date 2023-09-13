export interface stringKey {
  [key: string]: string;
}
export interface numberKey {
  [key: number]: string;
}
export interface poolInfoType {
  pid: number;
  name: string;
  rewardToken: string;
  rewardTokenIsNative: boolean;
  totalRewards: number;
  totalBlock: number;
  startBlock: number;
  lastRewardBlock: number;
  accPerShare: number;
}
