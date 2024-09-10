export const MAX_WEBSOCKET_FAILS = 7;
export const MIN_WEBSOCKET_RETRY_TIME = 3000; // 3 sec
export const MAX_WEBSOCKET_RETRY_TIME = 300000; // 5 mins
export const JITTER_RANGE = 2000; // 2 sec

export const WEBSOCKET_HELLO = 'hello';

export type MessageListener = (msg: WebSocketMessage) => void;
export type FirstConnectListener = () => void;
export type ReconnectListener = () => void;
export type MissedMessageListener = () => void;
export type ErrorListener = (event: Event) => void;
export type CloseListener = (connectFailCount: number) => void;

export type WebSocketBroadcast = {
  omit_users: Record<string, boolean>;
  user_id: string;
  channel_id: string;
  team_id: string;
};

export type WebSocketMessage<T = any> = {
  event: string;
  data: T;
  broadcast: WebSocketBroadcast;
  seq: number;
};
