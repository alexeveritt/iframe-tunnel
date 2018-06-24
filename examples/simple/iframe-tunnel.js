!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.events=[]}return Object.defineProperty(e.prototype,"count",{get:function(){return this.events?this.events.length:0},enumerable:!0,configurable:!0}),e.prototype.functionCount=function(e){if(!e)throw new Error("Invalid Parameter, key missing");var t=this.findEvent(e);return t&&t.funcs?t.funcs.length:0},e.prototype.on=function(e,t){if(!e)throw new Error("Invalid Parameter, key missing");return this.addEvent(e,t,0)},e.prototype.once=function(e,t){if(!e)throw new Error("Invalid Parameter, key missing");return this.addEvent(e,t,1)},e.prototype.many=function(e,t,n){if(!e)throw new Error("Invalid Parameter, key missing");return this.addEvent(e,t,n)},e.prototype.emit=function(e,t){if(!e)throw new Error("Invalid Parameter, key missing");var n=this.findEvent(e);if(n){var r=null;arguments.length>1&&(r=(r=[].splice.call(arguments,0)).splice(1));for(var i=0;i<n.funcs.length;i++)n.funcs[i].apply(this,r);n.count>0&&0==--n.count&&this.removeEvents(e)}},e.prototype.off=function(e,t){if(!e)throw new Error("Invalid Parameter, key missing");this.removeEvents(e,t)},e.prototype.offAll=function(){this.removeEvents()},e.prototype.offKey=function(e){if(!e)throw new Error("Invalid Parameter, key missing");this.removeEvents(e)},e.prototype.findEvent=function(e){if(!e)throw new Error("Invalid Parameter, key missing");var t={key:"",funcs:[],count:0};return this.events.forEach(function(n){n.key===e&&(t=n)}),t.key?t:null},e.prototype.removeEvents=function(e,t){var n=this.events;if(e){if(!t)for(var r=n.length-1;r>-1;r--)n[r].key===e&&n.splice(r,1);if(this.findEvent(e))for(r=n.length-1;r>-1;r--)for(var i=n[r].funcs,o=i.length-1;o>-1;o--)i[r]===t&&i.splice(r,1)}else n.splice(0,n.length);return n.length},e.prototype.addEvent=function(e,t,n){if(!e)throw new Error("Invalid Parameter, key missing");var r=this.findEvent(e);if(r){for(var i=0;i<r.funcs.length;i++)if(r.funcs[i]===t)return r.funcs.length}else r={key:e,funcs:[],count:n},this.events.push(r);return r.funcs.push(t),r.funcs.length},e}();t.JSEmitter=r},function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=n(0);t.connect=function(e){return e.iframeId?new s(e):new o(e)};var o=function(e){function t(t){var n=e.call(this)||this;return n.targetOrigin="*",window.addEventListener("message",n.onFrameMessage,!1),n.sendMessage("__jstunnel_ready"),n}return r(t,e),t.prototype.sendMessage=function(e,t){var n="string"==typeof t?t:JSON.stringify(t);window.parent.postMessage(n,this.targetOrigin)},t.prototype.onMessage=function(e,t){this.on(e,t)},t.prototype.onFrameMessage=function(e){if(("*"===this.targetOrigin||e.origin===this.targetOrigin)&&e.data)try{var t=JSON.parse(e.data);this.emit(t.key,t.data)}catch(e){}},t}(i.JSEmitter);t.ClientTunnel=o;var s=function(e){function t(t){var n=e.call(this)||this;if(n.isTunnelReady=!1,n.eventQueue=[],n.targetOrigin="*",n.reservedKeys={__jstunnel_ready:1},!t.iframeId)throw new Error("No Iframe Id");return n.iframeId=t.iframeId,n.on("__jstunnel_ready",n.onReady),window.addEventListener("message",n.onFrameMessage,!1),n}return r(t,e),t.prototype.sendMessage=function(e,t){if(1===this.reservedKeys[e])throw new Error("Invalid key, reserved");var n="string"==typeof t,r={payload:n?t:JSON.stringify(t),isText:n};this.isTunnelReady?this.processQueueEvent(r):this.eventQueue.push(r)},t.prototype.onMessage=function(e,t){this.on(e,t)},t.prototype.onReady=function(){this.isTunnelReady=!0,this.processQueuedEvents()},t.prototype.processQueueEvent=function(e){this.iframeId&&(this.iframeElement||(this.iframeElement=window.document.getElementById(this.iframeId)),this.iframeElement&&this.iframeElement.contentWindow&&this.iframeElement.contentWindow.postMessage(e.payload,this.targetOrigin))},t.prototype.processQueuedEvents=function(){var e=this;this.isTunnelReady&&(this.eventQueue&&this.eventQueue.length>0&&this.eventQueue.forEach(function(t){return e.processQueueEvent(t)}),this.eventQueue=[])},t.prototype.onFrameMessage=function(e){if(("*"===this.targetOrigin||e.origin===this.targetOrigin)&&e.data)try{var t=JSON.parse(e.data);this.emit(t.key,t.data)}catch(e){}},t}(i.JSEmitter);t.HostTunnel=s}]);