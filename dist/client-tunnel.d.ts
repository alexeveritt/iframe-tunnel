import { JSEmitter } from 'jsemitter';
import { Tunnel, TunnelOptions } from './index';
export declare class ClientTunnel extends JSEmitter implements Tunnel {
    private targetOrigin;
    constructor(options?: TunnelOptions);
    sendMessage(key: string, data?: string | object): void;
    onMessage(key: string, callback: (data?: string | object) => void): void;
    private onFrameMessage;
}
