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
var Host = (function (_super) {
    __extends(Host, _super);
    function Host(iframeId, targetOrigin) {
        if (targetOrigin === void 0) { targetOrigin = '*'; }
        var _this = _super.call(this) || this;
        _this.iframeId = iframeId;
        _this.targetOrigin = targetOrigin;
        _this.isTunnelReady = false;
        _this.eventQueue = [];
        _this.on('ready', _this.onReady);
        window.addEventListener("message", _this.onMessage, false);
        return _this;
    }
    Host.prototype.sendMessage = function (key, data) {
        var message = { key: key, data: data };
        var payload = JSON.stringify(message);
        var queueEvent = { payload: payload };
        this.isTunnelReady ? this.processQueueEvent(queueEvent) : this.eventQueue.push(queueEvent);
    };
    Host.prototype.onReady = function () {
        this.isTunnelReady = true;
        this.processQueuedEvents();
    };
    Host.prototype.processQueueEvent = function (evt) {
        var el = window.document.getElementById(this.iframeId);
        el.contentWindow.postMessage(evt.payload, this.targetOrigin);
    };
    Host.prototype.processQueuedEvents = function () {
        var _this = this;
        if (this.isTunnelReady) {
            if (this.eventQueue && this.eventQueue.length > 0) {
                this.eventQueue.forEach(function (evt) { return _this.processQueueEvent(evt); });
            }
            this.eventQueue = [];
        }
    };
    Host.prototype.onMessage = function (event) {
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
    return Host;
}(jsemitter_1.JSEmitter));
exports.Host = Host;
//# sourceMappingURL=host.js.map