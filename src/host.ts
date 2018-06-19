import {DomHelpers} from './dom-helpers';
import {EventEmitter} from "@src/event-emitter";

interface IQueueEvent {
    payload: string;
}


export class Host extends EventEmitter {

    private isTunnelReady = false;
    private eventQueue: IQueueEvent[] = [];

    constructor(private iframeId: string) {
        super();
        this.on('ready', this.onReady)
        window.addEventListener("message", this.onMessage, false);
    }

    public sendMessage(key: string, data: any) {
        const message: TunnelMessage = {key, data};


        const payload = JSON.stringify(message)

        let queueEvent = {payload};
        this.isTunnelReady ? this.processQueueEvent(queueEvent) : this.eventQueue.push(queueEvent);

        window.parent.postMessage(messageText, this.targetOrigin)
    }

    private onReady() {
        this.isTunnelReady = true;
        this.processQueuedEvents();
    }

    private processQueueEvent(evt: IQueueEvent): void {
        const el = window.document.getElementById(this.iframeId) as any;
        el.contentWindow.postMessage(evt.payload, this.session.settings.iFSrc);
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


export class Hosdt extends EventEmitter {
    private isTunnelReady = false;
    private eventQueue: IQueueEvent[] = [];

    constructor(private iframeId: string) {
        super()
        session.on('ready', () => {
            this.isTunnelReady = true;
            this.processQueuedEvents();
        });

        DomHelpers.on(session.settings.win, 'message', evt => {
            let evtData = null;

            try {
                evtData = JSON.parse(evt.data);
            } catch (err) {
                return err;
            }

            if (evtData.tunnelKey) {
                session.emit(evtData.tunnelKey, evtData.value);
            }

        });
    }

    public sendMessage(message: string, data: any): void {
        if (!data) {
            data = {};
        }
        data.token = this.session.token;
        let payload = {tunnelKey: message, value: data};
        let payloadText = JSON.stringify(payload);

        let queueEvent = {payload: payloadText};
        this.isTunnelReady ? this.processQueueEvent(queueEvent) : this.eventQueue.push(queueEvent);

    }

    private processQueueEvent(evt: IQueueEvent): void {
        let el = DomHelpers.el('phxi-ctp');
        el.contentWindow.postMessage(evt.payload, this.session.settings.iFSrc);
    }

    private processQueuedEvents(): void {
        if (this.isTunnelReady) {
            if (this.eventQueue && this.eventQueue.length > 0) {
                this.eventQueue.forEach(evt => this.processQueueEvent(evt));
            }
            this.eventQueue = [];
        }
    }
}
