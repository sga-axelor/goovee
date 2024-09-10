import {
  CloseListener,
  ErrorListener,
  FirstConnectListener,
  JITTER_RANGE,
  MAX_WEBSOCKET_FAILS,
  MAX_WEBSOCKET_RETRY_TIME,
  MIN_WEBSOCKET_RETRY_TIME,
  MessageListener,
  ReconnectListener,
  WEBSOCKET_HELLO,
} from './types';

export class WebSocketClient {
  private conn: WebSocket | null;
  private connectionUrl: string | null;
  private token: string;

  // responseSequence is the number to track a response sent
  // via the websocket. A response will always have the same sequence number
  // as the request.
  private responseSequence: number;

  // serverSequence is the incrementing sequence number from the
  // server-sent event stream.
  private serverSequence: number;
  private connectFailCount: number;
  private responseCallbacks: {[x: number]: (msg: any) => void};

  private messageListeners = new Set<MessageListener>();
  private firstConnectListeners = new Set<FirstConnectListener>();
  private reconnectListeners = new Set<ReconnectListener>();
  private errorListeners = new Set<ErrorListener>();
  private closeListeners = new Set<CloseListener>();

  private connectionId: string | null;

  constructor() {
    this.conn = null;
    this.connectionUrl = null;
    this.responseSequence = 1;
    this.serverSequence = 0;
    this.connectFailCount = 0;
    this.responseCallbacks = {};
    this.connectionId = '';
    this.token = '';
  }

  isConnected() {
    return this.conn ? true : false;
  }

  // on connect, only send auth cookie and blank state.
  // on hello, get the connectionID and store it.
  // on reconnect, send cookie, connectionID, sequence number.
  initialize(connectionUrl = this.connectionUrl, token: string) {
    console.debug('this.conn', this.conn);
    if (this.conn) {
      return;
    }

    if (connectionUrl == null) {
      console.log('websocket must have connection url');
      return;
    }

    if (this.connectFailCount === 0) {
      console.log('websocket connecting to ' + connectionUrl);
    }

    // Add connection id, and last_sequence_number to the query param.
    // We cannot use a cookie because it will bleed across tabs.
    // We cannot also send it as part of the auth_challenge, because the session cookie is already sent with the request.
    this.conn = new WebSocket(
      `${connectionUrl}?connection_id=${this.connectionId}&sequence_number=${this.serverSequence}`,
    );
    this.connectionUrl = connectionUrl;

    this.conn.onopen = () => {
      if (token) {
        this.token = token;
        this.sendMessage('authentication_challenge', {token});
      }
      if (this.connectFailCount > 0) {
        console.log('websocket re-established connection');

        this.reconnectListeners.forEach(listener => listener());
      } else if (this.firstConnectListeners.size > 0) {
        this.firstConnectListeners.forEach(listener => listener());
      }

      this.connectFailCount = 0;
    };

    this.conn.onclose = () => {
      this.conn = null;
      this.responseSequence = 1;

      if (this.connectFailCount === 0) {
        console.log('websocket closed');
      }

      this.connectFailCount++;

      this.closeListeners.forEach(listener => listener(this.connectFailCount));

      let retryTime = MIN_WEBSOCKET_RETRY_TIME;

      // If we've failed a bunch of connections then start backing off
      if (this.connectFailCount > MAX_WEBSOCKET_FAILS) {
        retryTime =
          MIN_WEBSOCKET_RETRY_TIME *
          this.connectFailCount *
          this.connectFailCount;
        if (retryTime > MAX_WEBSOCKET_RETRY_TIME) {
          retryTime = MAX_WEBSOCKET_RETRY_TIME;
        }
      }

      // Applying jitter to avoid thundering herd problems.
      retryTime += Math.random() * JITTER_RANGE;

      setTimeout(() => {
        this.initialize(connectionUrl, token);
      }, retryTime);
    };

    this.conn.onerror = evt => {
      if (this.connectFailCount <= 1) {
        console.log('websocket error');
        console.log(evt);
      }

      this.errorListeners.forEach(listener => listener(evt));
    };

    this.conn.onmessage = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.seq_reply) {
        // This indicates a reply to a websocket request.
        // We ignore sequence number validation of message responses
        // and only focus on the purely server side event stream.
        if (msg.error) {
          console.log(msg);
        }

        if (this.responseCallbacks[msg.seq_reply]) {
          this.responseCallbacks[msg.seq_reply](msg);
          Reflect.deleteProperty(this.responseCallbacks, msg.seq_reply);
        }
      } else if (this.messageListeners.size > 0) {
        // We check the hello packet, which is always the first packet in a stream.
        if (msg.event === WEBSOCKET_HELLO) {
          console.log('got connection id ', msg.data.connection_id);
          // If we already have a connectionId present, and server sends a different one,
          // that means it's either a long timeout, or server restart, or sequence number is not found.
          // Then we do the sync calls, and reset sequence number to 0.
          if (
            this.connectionId !== '' &&
            this.connectionId !== msg.data.connection_id
          ) {
            console.log(
              'long timeout, or server restart, or sequence number is not found.',
            );

            this.serverSequence = 0;
          }

          // If it's a fresh connection, we have to set the connectionId regardless.
          // And if it's an existing connection, setting it again is harmless, and keeps the code simple.
          this.connectionId = msg.data.connection_id;
        }

        // Now we check for sequence number, and if it does not match,
        // we just disconnect and reconnect.
        if (msg.seq !== this.serverSequence) {
          console.log(
            'missed websocket event, act_seq=' +
              msg.seq +
              ' exp_seq=' +
              this.serverSequence,
          );
          // We are not calling this.close() because we need to auto-restart.
          this.connectFailCount = 0;
          this.responseSequence = 1;
          this.conn?.close(); // Will auto-reconnect after MIN_WEBSOCKET_RETRY_TIME.
          return;
        }
        this.serverSequence = msg.seq + 1;

        this.messageListeners.forEach(listener => listener(msg));
      }
    };
  }

  addMessageListener(listener: MessageListener) {
    this.messageListeners.add(listener);

    if (this.messageListeners.size > 5) {
      console.warn(
        `WebSocketClient has ${this.messageListeners.size} message listeners registered`,
      );
    }
  }

  removeMessageListener(listener: MessageListener) {
    this.messageListeners.delete(listener);
  }

  addFirstConnectListener(listener: FirstConnectListener) {
    this.firstConnectListeners.add(listener);

    if (this.firstConnectListeners.size > 5) {
      console.warn(
        `WebSocketClient has ${this.firstConnectListeners.size} first connect listeners registered`,
      );
    }
  }

  removeFirstConnectListener(listener: FirstConnectListener) {
    this.firstConnectListeners.delete(listener);
  }

  addReconnectListener(listener: ReconnectListener) {
    this.reconnectListeners.add(listener);

    if (this.reconnectListeners.size > 5) {
      console.warn(
        `WebSocketClient has ${this.reconnectListeners.size} reconnect listeners registered`,
      );
    }
  }

  removeReconnectListener(listener: ReconnectListener) {
    this.reconnectListeners.delete(listener);
  }
  addErrorListener(listener: ErrorListener) {
    this.errorListeners.add(listener);

    if (this.errorListeners.size > 5) {
      console.warn(
        `WebSocketClient has ${this.errorListeners.size} error listeners registered`,
      );
    }
  }

  removeErrorListener(listener: ErrorListener) {
    this.errorListeners.delete(listener);
  }

  addCloseListener(listener: CloseListener) {
    this.closeListeners.add(listener);

    if (this.closeListeners.size > 5) {
      console.warn(
        `WebSocketClient has ${this.closeListeners.size} close listeners registered`,
      );
    }
  }

  removeCloseListener(listener: CloseListener) {
    this.closeListeners.delete(listener);
  }

  close() {
    this.connectFailCount = 0;
    this.responseSequence = 1;
    if (this.conn && this.conn.readyState === WebSocket.OPEN) {
      this.conn.onclose = () => {};
      this.conn.close();
      this.conn = null;
      console.log('websocket closed');
    }
  }

  sendMessage(
    action: string,
    data: any,
    responseCallback?: (msg: any) => void,
  ) {
    const msg = {
      action,
      seq: this.responseSequence++,
      data,
    };

    if (responseCallback) {
      this.responseCallbacks[msg.seq] = responseCallback;
    }

    if (this.conn && this.conn.readyState === WebSocket.OPEN) {
      this.conn.send(JSON.stringify(msg));
    } else if (!this.conn || this.conn.readyState === WebSocket.CLOSED) {
      this.conn = null;
      this.initialize(this.connectionUrl, this.token);
    }
  }

  userTyping(channelId: string, parentId: string, callback?: () => void) {
    const data = {
      channel_id: channelId,
      parent_id: parentId,
    };
    this.sendMessage('user_typing', data, callback);
  }

  updateActiveChannel(channelId: string, callback?: (msg: any) => void) {
    const data = {
      channel_id: channelId,
    };
    this.sendMessage('presence', data, callback);
  }

  updateActiveTeam(teamId: string, callback?: (msg: any) => void) {
    const data = {
      team_id: teamId,
    };
    this.sendMessage('presence', data, callback);
  }

  updateActiveThread(
    isThreadView: boolean,
    channelId: string,
    callback?: (msg: any) => void,
  ) {
    const data = {
      thread_channel_id: channelId,
      is_thread_view: isThreadView,
    };
    this.sendMessage('presence', data, callback);
  }

  userUpdateActiveStatus(
    userIsActive: boolean,
    manual: boolean,
    callback?: () => void,
  ) {
    const data = {
      user_is_active: userIsActive,
      manual,
    };
    this.sendMessage('user_update_active_status', data, callback);
  }

  getStatuses(callback?: () => void) {
    this.sendMessage('get_statuses', null, callback);
  }

  getStatusesByIds(userIds: string[], callback?: () => void) {
    const data = {
      user_ids: userIds,
    };
    this.sendMessage('get_statuses_by_ids', data, callback);
  }
}
