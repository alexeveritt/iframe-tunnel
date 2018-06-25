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
}

export function connect(options: TunnelOptions): Tunnel {

  //TODO Add a flag to allow client to defer ready state until completed any setup tasks
  // Currently ready is based on the tunnel being connected

  return options.iframeId ? new HostTunnel(options) : new ClientTunnel(options);
}
