import { ClientTunnel } from './client-tunnel';
import { HostTunnel } from './host-tunnel';

export interface Tunnel {
  sendMessage(key: string, data?: string | object): void;

  onMessage(key: string, callback: (data?: string | object) => void);
}

export interface TunnelOptions {
  iframeId?: string;
  targetOrigin?: string;
  waitForClient?: boolean;
  enableLogging?:boolean
}

export function connect(options: TunnelOptions = {}): Tunnel {
  return options.iframeId ? new HostTunnel(options) : new ClientTunnel(options);
}
