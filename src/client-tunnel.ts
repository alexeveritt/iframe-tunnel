import { JSEmitter } from 'jsemitter';
import { Tunnel, TunnelOptions } from './index';
import { attachDOMMessageEvent } from './utils/events';
import { log } from './utils/logger';
import { packMessage, unPackMessage } from './utils/packer';

export class ClientTunnel extends JSEmitter implements Tunnel {
  private readonly targetOrigin;
  private initialised: boolean = false;
  private readonly loggingEnabled: boolean = false;

  constructor(options: TunnelOptions = {}) {
    super();
    this.loggingEnabled = options.enableLogging || false;
    this.targetOrigin = options.targetOrigin || '*';

    attachDOMMessageEvent(event => this.onFrameMessage(event));

    if (!options.waitForClient) {
      if (this.loggingEnabled) {
        log('Client: Sending __jstunnel_ready message');
      }
      this.sendMessage('__jstunnel_ready');
      this.initialised = true;
    }
  }

  public sendMessage(key: string, data?: string | object): void {
    const isText = typeof data === 'string';

    if (!this.initialised && key === 'client-ready') {
      this.sendMessage('__jstunnel_ready');
      this.initialised = true;
      return;
    }
    if (this.loggingEnabled) {
      log(`Sending client message: ${isText ? data : JSON.stringify(data)}`);
    }
    const payload = packMessage(key, data);

    // TODO replace with proxy for testing
    window.parent.postMessage(payload, this.targetOrigin);
  }

  public onMessage(key: string, callback: (data?: string | object) => void) {
    this.on(key, callback);
  }

  private onFrameMessage(event) {
    if (this.loggingEnabled) {
      log('onFrameMessage client: ' + JSON.stringify(event));
    }
    if (event.data) {
      try {
        const message = unPackMessage(event.data);
        this.emit(message.key, message.data);
      } catch (ex) {
        // invalid data
      }
    }
  }
}
