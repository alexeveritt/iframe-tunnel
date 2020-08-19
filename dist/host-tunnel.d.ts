import { JSEmitter } from 'jsemitter';
import { Tunnel, TunnelOptions } from './index';
export declare class HostTunnel extends JSEmitter implements Tunnel {
    private isTunnelReady;
    private eventQueue;
    private targetOrigin;
    private readonly iframeId;
    private iframeElement;
    private readonly loggingEnabled;
    private reservedKeys;
    constructor(options?: TunnelOptions);
    sendMessage(key: string, data?: string | object): void;
    onMessage(key: string, callback: (data?: string | object) => void): void;
    private onReady;
    private processQueueEvent;
    private processQueuedEvents;
    private onFrameMessage;
}
