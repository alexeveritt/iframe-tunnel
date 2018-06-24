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
var ClientTunnel = (function (_super) {
    __extends(ClientTunnel, _super);
    function ClientTunnel(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.targetOrigin = '*';
        window.addEventListener('message', _this.onFrameMessage, false);
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
//# sourceMappingURL=client-tunnel.js.map