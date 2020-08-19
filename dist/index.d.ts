export interface Tunnel {
    sendMessage(key: string, data?: string | object): void;
    onMessage(key: string, callback: (data?: string | object) => void): any;
}
export interface TunnelOptions {
    iframeId?: string;
    targetOrigin?: string;
    waitForClient?: boolean;
    enableLogging?: boolean;
}
export declare function connect(options?: TunnelOptions): Tunnel;
