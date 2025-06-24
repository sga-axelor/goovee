import {getEnv} from '@/environment';

export function getHOST() {
  return (
    getEnv()?.GOOVEE_PUBLIC_MATTERMOST_HOST ||
    process.env.GOOVEE_PUBLIC_MATTERMOST_HOST
  );
}

export function getWebsocketURL() {
  return (
    getEnv()?.GOOVEE_PUBLIC_MATTERMOST_WEBSOCKET_URL ||
    process.env.GOOVEE_PUBLIC_MATTERMOST_WEBSOCKET_URL
  );
}
