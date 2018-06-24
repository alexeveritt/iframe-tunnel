export interface Tunnel {
    sendMessage(key: string, data?: string | object): void;
    onMessage(key: string, callback: (data?: string | object) => void): any;
}
export interface TunnelOptions {
    iframeId?: string;
    targetOrigin?: string;
}
export declare function connect(options: TunnelOptions): Tunnel;
