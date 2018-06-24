import { JSEmitter } from 'jsemitter';
import { Tunnel, TunnelOptions } from './index';

export class ClientTunnel extends JSEmitter implements Tunnel {
  private targetOrigin = '*';

  constructor(options: TunnelOptions = {}) {
    super();

    // this.on('__jstunnel_ready', this.onReady);
    window.addEventListener('message', this.onFrameMessage, false);
    this.sendMessage('__jstunnel_ready');
  }

  public sendMessage(key: string, data?: string | object): void {
    const isText = typeof data === 'string';

    const payload = isText ? (data as string) : JSON.stringify(data);
    window.parent.postMessage(payload, this.targetOrigin);
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
      } catch (ex) {
        // probably invalid json data
      }
    }
  }
}
