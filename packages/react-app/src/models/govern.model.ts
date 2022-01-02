import { TokenModel } from './token.model';

export type PayloadModel = {
  id: string;
  nonce?: number;
  executionTime: number;
  submitter: string;
  executor?: any;
  actions: { to: string; value: number; data: string }[];
  allowFailuresMap?: any;
  proof: string;
};

export type ConfigModel = {
  id: string;
  executionDelay: number; // how many seconds to wait before being able to call `execute`.
  scheduleDeposit: TokenModel; // fees for scheduling
  challengeDeposit: TokenModel; // fees for challenging
  resolver: string; // resolver that will rule the disputes
  rules: any; // rules of how DAO should be managed
  maxCalldataSize: number; // max calldatasize for the schedule
};

export type ContainerModel = {
  id: string;
  payload: PayloadModel;
  config: ConfigModel;
  state: string;
};
