// create a client

// create a host


import {JSEmitter} from "jsemitter";


export function connect(target: Target, options: TunnelOptions): Tunnel {
    switch (target) {
        case Target.Client:
            return new ClientTunnel(options);
        case Target.Host:
            return new HostTunnel(options);
    }
}

export interface Tunnel {
    sendMessage(key: string, data?: string | object): void
}

interface TunnelOptions {
    iframeId?: string
    targetOrigin?: string
}

export class ClientTunnel extends JSEmitter implements Tunnel {

    constructor(options: TunnelOptions) {
        super();
        window.addEventListener("message", this.onMessage, false);
    }

    public sendMessage(key: string, data?: string | object): void {
    }

}

export class HostTunnel extends JSEmitter implements Tunnel {

    private isTunnelReady = false;
    private eventQueue: IQueueEvent[] = [];
    private targetOrigin = '*';
    private iframeId = undefined;

    private reservedKeys = {
        __jstunnel_ready: 1
    };

    constructor(options: TunnelOptions) {
        super();
        this.on('__jstunnel_ready', this.onReady)
        window.addEventListener("message", this.onMessage, false);
    }

    public sendMessage(key: string, data?: string | object): void {

        if (this.reservedKeys[key] === 1) {
            throw new Error('Invalid key, reserved');
        }

    }


    private onReady() {
        this.isTunnelReady = true;
        this.processQueuedEvents();
    }

    private processQueueEvent(evt: IQueueEvent): void {
        const el = window.document.getElementById(this.iframeId) as any;
        el.contentWindow.postMessage(evt.payload, this.targetOrigin);
    }

    private processQueuedEvents(): void {
        if (this.isTunnelReady) {
            if (this.eventQueue && this.eventQueue.length > 0) {
                this.eventQueue.forEach(evt => this.processQueueEvent(evt));
            }
            this.eventQueue = [];
        }
    }

    private onMessage(event) {
        if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
            return;
        }
        if (event.data) {
            try {
                const message = JSON.parse(event.data);
                this.emit(message.key, message.data);
            }
            catch (ex) {

            }
        }
    }
}
