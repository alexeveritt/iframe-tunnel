interface TunnelMessage {
  key: string;
  data?: string | object;
}

interface QueueEvent {
  isText: boolean;
  payload: string;
}
