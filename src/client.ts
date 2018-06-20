import {EventEmitter} from "@src/event-emitter";


export class Client extends EventEmitter {
    constructor(private targetOrigin: string = '*') {
        super();
        window.addEventListener("message", this.onMessage, false);
    }

    public sendMessage(key: string, data: any) {
        const message: TunnelMessage = {key, data};


        const messageText = JSON.stringify(message);

        window.parent.postMessage(messageText, this.targetOrigin)
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

