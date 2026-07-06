import { BaseException } from '../errors/base.exception';
export declare function parseJSON<T>(json: unknown, guard: (value: unknown) => value is T): T | BaseException;
export declare function defer(fn: () => void): {
    [Symbol.dispose]: () => void;
};
//# sourceMappingURL=common.util.d.ts.map