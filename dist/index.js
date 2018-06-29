"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_tunnel_1 = require("./client-tunnel");
var host_tunnel_1 = require("./host-tunnel");
function connect(options) {
    if (options === void 0) { options = {}; }
    return options.iframeId ? new host_tunnel_1.HostTunnel(options) : new client_tunnel_1.ClientTunnel(options);
}
exports.connect = connect;
//# sourceMappingURL=index.js.map