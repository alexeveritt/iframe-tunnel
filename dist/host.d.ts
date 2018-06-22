import { JSEmitter } from "jsemitter";
export declare class Host extends JSEmitter {
    private iframeId;
    private targetOrigin;
    private isTunnelReady;
    private eventQueue;
    constructor(iframeId: string, targetOrigin?: string);
    sendMessage(key: string, data: any): void;
    private onReady();
    private processQueueEvent(evt);
    private processQueuedEvents();
    private onMessage(event);
}
