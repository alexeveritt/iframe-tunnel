import { JSEmitter } from 'jsemitter';
import { Tunnel, TunnelOptions } from './index';
import { log } from './utils/logger';
import { packMessage, unPackMessage } from './utils/packer';
import { attachDOMMessageEvent } from './utils/events';

export class ClientTunnel extends JSEmitter implements Tunnel {
  private targetOrigin = '*';

  constructor(options: TunnelOptions = {}) {
    super();

    // this.on('__jstunnel_ready', this.onReady);
    attachDOMMessageEvent(event=>this.onFrameMessage(event));
    // window.addEventListener('message', this.onFrameMessage, false);
    log('Client: Sending __jstunnel_ready message');
    this.sendMessage('__jstunnel_ready');
  }

  public sendMessage(key: string, data?: string | object): void {
    const isText = typeof data === 'string';
    log(`Sending clent message: ${isText ? data : JSON.stringify(data)}`);
    //const payload = isText ? (data as string) : JSON.stringify(data);
    const payload = packMessage(key, data);
    log(`client to host payload: ${payload} and target origin is ${this.targetOrigin}`);
    window.parent.postMessage(payload, this.targetOrigin);
  }

  public onMessage(key: string, callback: (data?: string | object) => void) {
    this.on(key, callback);
  }

  private onFrameMessage(event) {

    // TODO BIND THIS TO MESSAGE!!!

    // if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
    //   return;
    // }

    log('onFrameMessage client: ' + JSON.stringify(event));
    if (event.data) {
      const message = unPackMessage(event.data);
      this.emit(message.key, message.data);
    }
  }
}
