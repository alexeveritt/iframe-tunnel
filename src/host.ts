import {JSEmitter} from "jsemitter";

interface IQueueEvent {
    payload: string;
}


export class Host extends JSEmitter {

    private isTunnelReady = false;
    private eventQueue: IQueueEvent[] = [];

    constructor(private iframeId: string, private targetOrigin: string = '*') {
        super();
        this.on('__jstunnel-ready', this.onReady)
        window.addEventListener("message", this.onMessage, false);
    }

    public sendMessage(key: string, data: any) {
        const message: TunnelMessage = {key, data};


        const payload = JSON.stringify(message);

        let queueEvent = {payload};
        this.isTunnelReady ? this.processQueueEvent(queueEvent) : this.eventQueue.push(queueEvent);

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
