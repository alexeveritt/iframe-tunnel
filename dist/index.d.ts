import { JSEmitter } from "jsemitter";
export declare function connect(target: Target, options: TunnelOptions): Tunnel;
export interface Tunnel {
    sendMessage(key: string, data?: string | object): void;
    onMessage(key: string, callback: (data?: string | object) => void): any;
}
export interface TunnelOptions {
    iframeId?: string;
    targetOrigin?: string;
}
export declare class ClientTunnel extends JSEmitter implements Tunnel {
    private targetOrigin;
    constructor(options: TunnelOptions);
    sendMessage(key: string, data?: string | object): void;
    onMessage(key: string, callback: (data?: string | object) => void): void;
    private onFrameMessage(event);
}
export declare class HostTunnel extends JSEmitter implements Tunnel {
    private isTunnelReady;
    private eventQueue;
    private targetOrigin;
    private readonly iframeId;
    private iframeElement;
    private reservedKeys;
    constructor(options: TunnelOptions);
    sendMessage(key: string, data?: string | object): void;
    onMessage(key: string, callback: (data?: string | object) => void): void;
    private onReady();
    private processQueueEvent(evt);
    private processQueuedEvents();
    private onFrameMessage(event);
}
