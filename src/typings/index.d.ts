interface TunnelMessage {
  key: string;
  hasData: boolean;
  isText: boolean;
  data?: string | object;
}

interface QueueEvent {
  isText: boolean;
  payload: string;
}
