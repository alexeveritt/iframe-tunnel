"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log(message) {
    var consoleProperty = 'console';
    if (window && window[consoleProperty]) {
        var cs = window[consoleProperty];
        if (cs) {
            cs.log(new Date() + ": " + message + " ");
        }
    }
}
exports.log = log;
//# sourceMappingURL=logger.js.map