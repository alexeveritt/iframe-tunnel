"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var jsemitter_1 = require("jsemitter");
var events_1 = require("./utils/events");
var logger_1 = require("./utils/logger");
var packer_1 = require("./utils/packer");
var HostTunnel = (function (_super) {
    __extends(HostTunnel, _super);
    function HostTunnel(options) {
        if (options === void 0) { options = {}; }
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
        events_1.attachDOMMessageEvent(function (event) { return _this.onFrameMessage(event); });
        return _this;
    }
    HostTunnel.prototype.sendMessage = function (key, data) {
        if (this.reservedKeys[key] === 1) {
            throw new Error('Invalid key, reserved');
        }
        var isText = typeof data === 'string';
        logger_1.log("Sending clent message: " + (isText ? data : JSON.stringify(data)));
        var payload = packer_1.packMessage(key, data);
        logger_1.log("host to client payload: " + payload);
        var queueEvent = { payload: payload, isText: isText };
        this.isTunnelReady
            ? this.processQueueEvent(queueEvent)
            : this.eventQueue.push(queueEvent);
    };
    HostTunnel.prototype.onMessage = function (key, callback) {
        this.on(key, callback);
    };
    HostTunnel.prototype.onReady = function () {
        logger_1.log('Host: Tunnel Ready');
        this.isTunnelReady = true;
        this.processQueuedEvents();
    };
    HostTunnel.prototype.processQueueEvent = function (evt) {
        logger_1.log('Host: processQueueEvent');
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
            logger_1.log('Host: processQueueEvent');
            if (this.eventQueue && this.eventQueue.length > 0) {
                this.eventQueue.forEach(function (evt) { return _this.processQueueEvent(evt); });
            }
            this.eventQueue = [];
        }
    };
    HostTunnel.prototype.onFrameMessage = function (event) {
        logger_1.log('onFrameMessage host: ' + JSON.stringify(event));
        if (event.data) {
            var message = packer_1.unPackMessage(event.data);
            this.emit(message.key, message.data);
        }
    };
    return HostTunnel;
}(jsemitter_1.JSEmitter));
exports.HostTunnel = HostTunnel;
//# sourceMappingURL=host-tunnel.js.map