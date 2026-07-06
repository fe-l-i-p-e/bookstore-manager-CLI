"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSON = parseJSON;
exports.defer = defer;
const base_exception_1 = require("../errors/base.exception");
function parseJSON(json, guard) {
    try {
        if (typeof json !== 'string') {
            return new base_exception_1.BaseException({
                cause: 'JSON PARSE ERROR: Cannot parse a non-string'
            });
        }
        const parsed = JSON.parse(json);
        if (!guard(parsed)) {
            return new base_exception_1.BaseException({
                cause: 'JSON PARSE ERROR: parsed value failed the type guard'
            });
        }
        return parsed;
    }
    catch (error) {
        return base_exception_1.BaseException.fromUnknown(error, { messagePrefix: 'JSON PARSE: ' });
    }
}
function defer(fn) {
    return {
        [Symbol.dispose]: fn
    };
}
//# sourceMappingURL=common.util.js.map