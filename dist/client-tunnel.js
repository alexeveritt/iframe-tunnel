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
var ClientTunnel = (function (_super) {
    __extends(ClientTunnel, _super);
    function ClientTunnel(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.initialised = false;
        _this.loggingEnabled = false;
        _this.loggingEnabled = options.enableLogging || false;
        _this.targetOrigin = options.targetOrigin || '*';
        events_1.attachDOMMessageEvent(function (event) { return _this.onFrameMessage(event); });
        if (!options.waitForClient) {
            if (_this.loggingEnabled) {
                logger_1.log('Client: Sending __jstunnel_ready message');
            }
            _this.sendMessage('__jstunnel_ready');
            _this.initialised = true;
        }
        return _this;
    }
    ClientTunnel.prototype.sendMessage = function (key, data) {
        var isText = typeof data === 'string';
        if (!this.initialised && key === 'client-ready') {
            this.sendMessage('__jstunnel_ready');
            this.initialised = true;
            return;
        }
        if (this.loggingEnabled) {
            logger_1.log("Sending client message: " + (isText ? data : JSON.stringify(data)));
        }
        var payload = packer_1.packMessage(key, data);
        window.parent.postMessage(payload, this.targetOrigin);
    };
    ClientTunnel.prototype.onMessage = function (key, callback) {
        this.on(key, callback);
    };
    ClientTunnel.prototype.onFrameMessage = function (event) {
        if (this.loggingEnabled) {
            logger_1.log('onFrameMessage client: ' + JSON.stringify(event));
        }
        if (event.data) {
            try {
                var message = packer_1.unPackMessage(event.data);
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