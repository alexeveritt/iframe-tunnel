import { JSEmitter } from 'jsemitter';
import { Tunnel, TunnelOptions } from './index';

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
    window.addEventListener('message', this.onFrameMessage, false);
  }

  public sendMessage(key: string, data?: string | object): void {
    if (this.reservedKeys[key] === 1) {
      throw new Error('Invalid key, reserved');
    }

    const isText = typeof data === 'string';

    const payload = isText ? (data as string) : JSON.stringify(data);

    const queueEvent: QueueEvent = { payload, isText };
    this.isTunnelReady
      ? this.processQueueEvent(queueEvent)
      : this.eventQueue.push(queueEvent);
  }

  public onMessage(key: string, callback: (data?: string | object) => void) {
    this.on(key, callback);
  }

  private onReady() {
    this.isTunnelReady = true;
    this.processQueuedEvents();
  }

  private processQueueEvent(evt: QueueEvent): void {
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
      } catch (ex) {
        // probably invalid json data
      }
    }
  }
}
