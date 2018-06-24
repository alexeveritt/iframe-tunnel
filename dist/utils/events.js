"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function attachDOMMessageEvent(callback) {
    if (window) {
        var supportedEventListener = window.addEventListener
            ? 'addEventListener'
            : 'attachEvent';
        var eventListener = window[supportedEventListener];
        var messageEvent = supportedEventListener == 'attachEvent' ? 'onmessage' : 'message';
        eventListener(messageEvent, callback, false);
    }
}
exports.attachDOMMessageEvent = attachDOMMessageEvent;
//# sourceMappingURL=events.js.map