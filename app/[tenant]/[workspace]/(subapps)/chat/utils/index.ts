export function getHOST() {
  return (
    process.env.MATTERMOST_HOST ||
    process.env.GOOVEE_PUBLIC_MATTERMOST_HOST ||
    process.env.VITE_MATTERMOST_HOST
  );
}

export function getWebsocketURL() {
  return (
    process.env.MATTERMOST_WEBSOCKET_URL ||
    process.env.GOOVEE_PUBLIC_MATTERMOST_WEBSOCKET_URL ||
    process.env.VITE_MATTERMOST_WEBSOCKET_URL
  );
}
