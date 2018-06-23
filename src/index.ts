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

    onMessage(key: string, callback: (data?: string | object) => void)
}

export interface TunnelOptions {
    iframeId?: string
    targetOrigin?: string
}

export class ClientTunnel extends JSEmitter implements Tunnel {
    private targetOrigin = '*';

    constructor(options: TunnelOptions) {
        super();

        // this.on('__jstunnel_ready', this.onReady);
        window.addEventListener("message", this.onFrameMessage, false);
        this.sendMessage('__jstunnel_ready');
    }


    public sendMessage(key: string, data?: string | object): void {
        const isText = typeof data === 'string';

        const payload = isText ? data as string : JSON.stringify(data);
        window.parent.postMessage(payload, this.targetOrigin)
    }

    public onMessage(key: string, callback: (data?: string | object) => void) {
        this.on(key, callback);
    }

    private onFrameMessage(event) {
        if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
            return;
        }

        if (event.data) {
            try {
                // convert to string or object // add some meta to describe type
                const message = JSON.parse(event.data);
                this.emit(message.key, message.data);
            }
            catch (ex) {
                // probably invalid json data
            }
        }
    }
}

export class HostTunnel extends JSEmitter implements Tunnel {

    private isTunnelReady = false;
    private eventQueue: IQueueEvent[] = [];
    private targetOrigin = '*';
    private readonly iframeId: string;
    private iframeElement: HTMLIFrameElement;
    private reservedKeys = {
        __jstunnel_ready: 1
    };

    constructor(options: TunnelOptions) {
        super();
        if (!options.iframeId) {
            throw new Error('No Iframe Id')
        }
        this.iframeId = options.iframeId;

        this.on('__jstunnel_ready', this.onReady);
        window.addEventListener("message", this.onFrameMessage, false);
    }

    public sendMessage(key: string, data?: string | object): void {

        if (this.reservedKeys[key] === 1) {
            throw new Error('Invalid key, reserved');
        }

        const isText = typeof data === 'string';

        const payload = isText ? data as string : JSON.stringify(data);

        let queueEvent: IQueueEvent = {payload, isText};
        this.isTunnelReady ? this.processQueueEvent(queueEvent) : this.eventQueue.push(queueEvent);
    }


    public onMessage(key: string, callback: (data?: string | object) => void) {
        this.on(key, callback);
    }

    private onReady() {
        this.isTunnelReady = true;
        this.processQueuedEvents();
    }

    private processQueueEvent(evt: IQueueEvent): void {
        if (this.iframeId) {
            if (!this.iframeElement) {
                this.iframeElement = window.document.getElementById(this.iframeId) as HTMLIFrameElement;
            }
            if (this.iframeElement && this.iframeElement.contentWindow) {
                this.iframeElement.contentWindow.postMessage(evt.payload, this.targetOrigin);
            }
        }
    }

    private processQueuedEvents(): void {
        if (this.isTunnelReady) {
            if (this.eventQueue && this.eventQueue.length > 0) {
                this.eventQueue.forEach(evt => this.processQueueEvent(evt));
            }
            this.eventQueue = [];
        }
    }

    private onFrameMessage(event) {
        if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
            return;
        }

        if (event.data) {
            try {
                // convert to string or object // add some meta to describe type
                const message = JSON.parse(event.data);
                this.emit(message.key, message.data);
            }
            catch (ex) {
                // probably invalid json data
            }
        }
    }
}
