"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log(message) {
    if (window && window['console']) {
        var cs = window['console'];
        if (cs) {
            cs.log(new Date() + ": " + message + " ");
        }
    }
}
exports.log = log;
//# sourceMappingURL=logger.js.map