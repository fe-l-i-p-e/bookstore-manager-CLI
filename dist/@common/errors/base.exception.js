"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
/**
 * Base exception class
 *
 * This class is meant to be used as an Error class for all other exceptions.
 *
 */
class BaseException extends Error {
    constructor(options) {
        super();
        this.name = this.constructor.name;
        if (!options) {
            return this;
        }
        this.code = options.code;
        if (options.cause instanceof Error) {
            this.stack = options.cause.stack;
        }
        this.message = `${options.messagePrefix ?? ''}${BaseException.formatCause(options.cause)}`;
    }
    static formatCause(cause) {
        if (typeof cause === 'string') {
            return cause;
        }
        if (cause instanceof Error) {
            return `Cause - ${cause.name}: ${cause.message}`;
        }
        try {
            return JSON.stringify(cause, null, 2);
        }
        catch {
            return 'unidentifiable cause';
        }
    }
    static isError(error) {
        return error instanceof BaseException;
    }
    static fromError(error, options) {
        return new BaseException({
            cause: error,
            ...options
        });
    }
    static fromUnknown(unknown, options) {
        return new BaseException({
            cause: unknown,
            ...options
        });
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=base.exception.js.map