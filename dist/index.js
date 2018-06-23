"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var jsemitter_1 = require("jsemitter");
function connect(target, options) {
    switch (target) {
        case 0:
            return new ClientTunnel(options);
        case 1:
            return new HostTunnel(options);
    }
}
exports.connect = connect;
var ClientTunnel = (function (_super) {
    __extends(ClientTunnel, _super);
    function ClientTunnel(options) {
        var _this = _super.call(this) || this;
        _this.targetOrigin = '*';
        window.addEventListener("message", _this.onFrameMessage, false);
        _this.sendMessage('__jstunnel_ready');
        return _this;
    }
    ClientTunnel.prototype.sendMessage = function (key, data) {
        var isText = typeof data === 'string';
        var payload = isText ? data : JSON.stringify(data);
        window.parent.postMessage(payload, this.targetOrigin);
    };
    ClientTunnel.prototype.onMessage = function (key, callback) {
        this.on(key, callback);
    };
    ClientTunnel.prototype.onFrameMessage = function (event) {
        if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
            return;
        }
        if (event.data) {
            try {
                var message = JSON.parse(event.data);
                this.emit(message.key, message.data);
            }
            catch (ex) {
            }
        }
    };
    return ClientTunnel;
}(jsemitter_1.JSEmitter));
exports.ClientTunnel = ClientTunnel;
var HostTunnel = (function (_super) {
    __extends(HostTunnel, _super);
    function HostTunnel(options) {
        var _this = _super.call(this) || this;
        _this.isTunnelReady = false;
        _this.eventQueue = [];
        _this.targetOrigin = '*';
        _this.reservedKeys = {
            __jstunnel_ready: 1
        };
        if (!options.iframeId) {
            throw new Error('No Iframe Id');
        }
        _this.iframeId = options.iframeId;
        _this.on('__jstunnel_ready', _this.onReady);
        window.addEventListener("message", _this.onFrameMessage, false);
        return _this;
    }
    HostTunnel.prototype.sendMessage = function (key, data) {
        if (this.reservedKeys[key] === 1) {
            throw new Error('Invalid key, reserved');
        }
        var isText = typeof data === 'string';
        var payload = isText ? data : JSON.stringify(data);
        var queueEvent = { payload: payload, isText: isText };
        this.isTunnelReady ? this.processQueueEvent(queueEvent) : this.eventQueue.push(queueEvent);
    };
    HostTunnel.prototype.onMessage = function (key, callback) {
        this.on(key, callback);
    };
    HostTunnel.prototype.onReady = function () {
        this.isTunnelReady = true;
        this.processQueuedEvents();
    };
    HostTunnel.prototype.processQueueEvent = function (evt) {
        if (this.iframeId) {
            if (!this.iframeElement) {
                this.iframeElement = window.document.getElementById(this.iframeId);
            }
            if (this.iframeElement && this.iframeElement.contentWindow) {
                this.iframeElement.contentWindow.postMessage(evt.payload, this.targetOrigin);
            }
        }
    };
    HostTunnel.prototype.processQueuedEvents = function () {
        var _this = this;
        if (this.isTunnelReady) {
            if (this.eventQueue && this.eventQueue.length > 0) {
                this.eventQueue.forEach(function (evt) { return _this.processQueueEvent(evt); });
            }
            this.eventQueue = [];
        }
    };
    HostTunnel.prototype.onFrameMessage = function (event) {
        if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
            return;
        }
        if (event.data) {
            try {
                var message = JSON.parse(event.data);
                this.emit(message.key, message.data);
            }
            catch (ex) {
            }
        }
    };
    return HostTunnel;
}(jsemitter_1.JSEmitter));
exports.HostTunnel = HostTunnel;
//# sourceMappingURL=index.js.map