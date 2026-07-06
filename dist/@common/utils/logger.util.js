"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerUtil = void 0;
class LoggerUtil {
    static error(error) {
        if (!process.env.DEBUG) {
            return;
        }
        console.error(error);
    }
}
exports.LoggerUtil = LoggerUtil;
//# sourceMappingURL=logger.util.js.map