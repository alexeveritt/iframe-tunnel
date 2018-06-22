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
var Client = (function (_super) {
    __extends(Client, _super);
    function Client(targetOrigin) {
        if (targetOrigin === void 0) { targetOrigin = '*'; }
        var _this = _super.call(this) || this;
        _this.targetOrigin = targetOrigin;
        window.addEventListener("message", _this.onMessage, false);
        return _this;
    }
    Client.prototype.sendMessage = function (key, data) {
        var message = { key: key, data: data };
        var messageText = JSON.stringify(message);
        window.parent.postMessage(messageText, this.targetOrigin);
    };
    Client.prototype.onMessage = function (event) {
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
    return Client;
}(jsemitter_1.JSEmitter));
exports.Client = Client;
//# sourceMappingURL=client.js.map