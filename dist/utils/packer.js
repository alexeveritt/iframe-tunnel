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
//# sourceMappingURL=packer.js.map