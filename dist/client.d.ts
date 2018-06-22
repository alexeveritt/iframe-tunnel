import { JSEmitter } from "jsemitter";
export declare class Client extends JSEmitter {
    private targetOrigin;
    constructor(targetOrigin?: string);
    sendMessage(key: string, data: any): void;
    private onMessage(event);
}
