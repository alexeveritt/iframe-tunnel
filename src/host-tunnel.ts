import { JSEmitter } from 'jsemitter';
import { Tunnel, TunnelOptions } from './index';
import { attachDOMMessageEvent } from './utils/events';
import { log } from './utils/logger';
import { packMessage, unPackMessage } from './utils/packer';

export class HostTunnel extends JSEmitter implements Tunnel {
  private isTunnelReady = false;
  private eventQueue: QueueEvent[] = [];
  private targetOrigin = '*';
  private readonly iframeId: string;
  private iframeElement: HTMLIFrameElement;
  private reservedKeys = {
    __jstunnel_ready: 1
  };

  constructor(options: TunnelOptions = {}) {
    super();
    if (!options.iframeId) {
      throw new Error('No Iframe Id');
    }
    this.iframeId = options.iframeId;

    this.on('__jstunnel_ready', this.onReady);
    attachDOMMessageEvent(event => this.onFrameMessage(event));
  }

  public sendMessage(key: string, data?: string | object): void {
    if (this.reservedKeys[key] === 1) {
      throw new Error('Invalid key, reserved');
    }

    const isText = typeof data === 'string';
    log(`Sending clent message: ${isText ? data : JSON.stringify(data)}`);
    const payload = packMessage(key, data);
    log(`host to client payload: ${payload}`);
    const queueEvent: QueueEvent = { payload, isText };
    this.isTunnelReady
      ? this.processQueueEvent(queueEvent)
      : this.eventQueue.push(queueEvent);
  }

  public onMessage(key: string, callback: (data?: string | object) => void) {
    this.on(key, callback);
  }

  private onReady() {
    log('Host: Tunnel Ready');
    this.isTunnelReady = true;
    this.processQueuedEvents();
  }

  private processQueueEvent(evt: QueueEvent): void {
    log('Host: processQueueEvent');
    if (this.iframeId) {
      if (!this.iframeElement) {
        this.iframeElement = window.document.getElementById(
          this.iframeId
        ) as HTMLIFrameElement;
      }
      if (this.iframeElement && this.iframeElement.contentWindow) {
        this.iframeElement.contentWindow.postMessage(
          evt.payload,
          this.targetOrigin
        );
      }
    }
  }

  private processQueuedEvents(): void {
    if (this.isTunnelReady) {
      log('Host: processQueueEvent');
      if (this.eventQueue && this.eventQueue.length > 0) {
        this.eventQueue.forEach(evt => this.processQueueEvent(evt));
      }
      this.eventQueue = [];
    }
  }

  private onFrameMessage(event) {
    log('onFrameMessage host: ' + JSON.stringify(event));

    if (event.data) {
      const message = unPackMessage(event.data);
      this.emit(message.key, message.data);
    }
  }
}
