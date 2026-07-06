/**  | Error
  | string
  | Record<string | number | symbol, unknown>
  | Record<string | number | symbol, unknown>[] */
export type ErrorCause = unknown;
export interface BaseExceptionConstructorOptions {
    code?: string;
    cause: ErrorCause;
    messagePrefix?: string;
}
/**
 * Base exception class
 *
 * This class is meant to be used as an Error class for all other exceptions.
 *
 */
export declare class BaseException extends Error {
    protected code?: string;
    constructor(options?: BaseExceptionConstructorOptions);
    protected static formatCause(cause: ErrorCause): string;
    static isError(error: unknown): error is BaseException;
    static fromError(error: Error, options?: Omit<BaseExceptionConstructorOptions, 'cause'>): BaseException;
    static fromUnknown(unknown: unknown, options?: Omit<BaseExceptionConstructorOptions, 'cause'>): BaseException;
}
//# sourceMappingURL=base.exception.d.ts.map