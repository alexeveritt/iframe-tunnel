var IFrameTunnel =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var client_tunnel_1 = __webpack_require__(1);
var host_tunnel_1 = __webpack_require__(6);
function connect(options) {
    return options.iframeId ? new host_tunnel_1.HostTunnel(options) : new client_tunnel_1.ClientTunnel(options);
}
exports.connect = connect;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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
var jsemitter_1 = __webpack_require__(2);
var logger_1 = __webpack_require__(3);
var packer_1 = __webpack_require__(4);
var events_1 = __webpack_require__(5);
var ClientTunnel = (function (_super) {
    __extends(ClientTunnel, _super);
    function ClientTunnel(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.targetOrigin = '*';
        events_1.attachDOMMessageEvent(_this.onFrameMessage);
        logger_1.log('Client: Sending __jstunnel_ready message');
        _this.sendMessage('__jstunnel_ready');
        return _this;
    }
    ClientTunnel.prototype.sendMessage = function (key, data) {
        var isText = typeof data === 'string';
        logger_1.log("Sending clent message: " + (isText ? data : JSON.stringify(data)));
        var payload = packer_1.packMessage(key, data);
        logger_1.log("client to host payload: " + payload + " and target origin is " + this.targetOrigin);
        window.parent.postMessage(payload, this.targetOrigin);
    };
    ClientTunnel.prototype.onMessage = function (key, callback) {
        this.on(key, callback);
    };
    ClientTunnel.prototype.onFrameMessage = function (event) {
        logger_1.log('onFrameMessage client: ' + JSON.stringify(event));
        if (event.data) {
            var message = packer_1.unPackMessage(event.data);
            this.emit(message.key, message.data);
        }
    };
    return ClientTunnel;
}(jsemitter_1.JSEmitter));
exports.ClientTunnel = ClientTunnel;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JSEmitter = (function () {
    function JSEmitter() {
        this.events = [];
    }
    Object.defineProperty(JSEmitter.prototype, "count", {
        get: function () {
            return this.events ? this.events.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    JSEmitter.prototype.functionCount = function (key) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        var evt = this.findEvent(key);
        if (evt && evt.funcs) {
            return evt.funcs.length;
        }
        return 0;
    };
    JSEmitter.prototype.on = function (key, func) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        return this.addEvent(key, func, 0);
    };
    JSEmitter.prototype.once = function (key, func) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        return this.addEvent(key, func, 1);
    };
    JSEmitter.prototype.many = function (key, func, count) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        return this.addEvent(key, func, count);
    };
    JSEmitter.prototype.emit = function (key, data) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        var evt = this.findEvent(key);
        if (evt) {
            var args = null;
            if (arguments.length > 1) {
                args = [].splice.call(arguments, 0);
                args = args.splice(1);
            }
            for (var i = 0; i < evt.funcs.length; i++) {
                evt.funcs[i].apply(this, args);
            }
            if (evt.count > 0 && --evt.count === 0) {
                this.removeEvents(key);
            }
        }
    };
    JSEmitter.prototype.off = function (key, func) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        this.removeEvents(key, func);
    };
    ;
    JSEmitter.prototype.offAll = function () {
        this.removeEvents();
    };
    ;
    JSEmitter.prototype.offKey = function (key) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        this.removeEvents(key);
    };
    ;
    JSEmitter.prototype.findEvent = function (key) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        var foundItem = { key: '', funcs: [], count: 0 };
        this.events.forEach(function (itm) {
            if (itm.key === key) {
                foundItem = itm;
            }
        });
        return foundItem.key ? foundItem : null;
    };
    JSEmitter.prototype.removeEvents = function (key, func) {
        var evts = this.events;
        if (!key) {
            evts.splice(0, evts.length);
        }
        else {
            if (!func) {
                for (var i = evts.length - 1; i > -1; i--) {
                    if (evts[i].key === key) {
                        evts.splice(i, 1);
                    }
                }
            }
            var evt = this.findEvent(key);
            if (evt) {
                for (var i = evts.length - 1; i > -1; i--) {
                    var funcs = evts[i].funcs;
                    for (var j = funcs.length - 1; j > -1; j--) {
                        if (funcs[i] === func) {
                            funcs.splice(i, 1);
                        }
                    }
                }
            }
        }
        return evts.length;
    };
    ;
    JSEmitter.prototype.addEvent = function (key, func, count) {
        if (!key) {
            throw new Error('Invalid Parameter, key missing');
        }
        var evt = this.findEvent(key);
        if (!evt) {
            evt = { key: key, funcs: [], count: count };
            this.events.push(evt);
        }
        else {
            for (var i = 0; i < evt.funcs.length; i++) {
                if (evt.funcs[i] === func) {
                    return evt.funcs.length;
                }
            }
        }
        evt.funcs.push(func);
        return evt.funcs.length;
    };
    ;
    return JSEmitter;
}());
exports.JSEmitter = JSEmitter;
//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function packMessage(key, data) {
    var hasData = !!data;
    var isText = !hasData || typeof data === 'string';
    var packedObject = {
        key: key,
        hasData: hasData,
        isText: isText,
        data: data
    };
    return JSON.stringify(packedObject);
}
exports.packMessage = packMessage;
function unPackMessage(message) {
    return JSON.parse(message);
}
exports.unPackMessage = unPackMessage;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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
var jsemitter_1 = __webpack_require__(2);
var logger_1 = __webpack_require__(3);
var packer_1 = __webpack_require__(4);
var events_1 = __webpack_require__(5);
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
        events_1.attachDOMMessageEvent(_this.onFrameMessage);
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


/***/ })
/******/ ]);