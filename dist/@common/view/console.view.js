"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleView = void 0;
const base_exception_1 = require("../errors/base.exception");
const common_util_1 = require("../utils/common.util");
const logger_util_1 = require("../utils/logger.util");
const readline_interface_util_1 = require("../utils/readline-interface.util");
class ConsoleView {
    constructor(isRootView = false) {
        this.isRootView = isRootView;
        this.isInView = true;
        this.aborted = false;
        this.readlineInterface = readline_interface_util_1.ReadlineInterfaceUtil.readlineInterface;
    }
    resetState() {
        this.isInView = true;
        this.aborted = false;
    }
    async promptUntilValid(prompt, schema) {
        const parseResponse = (response, schema) => {
            if (!response) {
                if (schema.default) {
                    return [true, schema.default];
                }
                if (schema.required) {
                    this.display('Campo obrigatório! Tente novamente...');
                    return [false, null];
                }
                return [true, null];
            }
            if (schema.type === 'string') {
                return [true, response];
            }
            if (schema.type === 'number') {
                this.display('Digite um número válido! Tente novamente...');
                const n = Number(response);
                return [!Number.isNaN(n), n];
            }
            if (response.toLowerCase() !== 'true' &&
                response.toLocaleLowerCase() !== 'false') {
                this.display('O campo só pode ser verdadeiro ou falso! Tente novamente...');
                return [false, null];
            }
            return [true, Boolean(response)];
        };
        for (;;) {
            const response = await this.prompt(prompt);
            const [isValid, parsedResponse] = parseResponse(response, schema);
            if (isValid) {
                return parsedResponse;
            }
        }
    }
    async prompt(message) {
        if (this.aborted) {
            return ConsoleView.ABORT_SENTINEL;
        }
        const controller = new AbortController();
        const onSigint = () => {
            controller.abort();
        };
        this.readlineInterface.once('SIGINT', onSigint);
        try {
            return await this.readlineInterface.question(message, {
                signal: controller.signal
            });
        }
        catch (error) {
            if (controller.signal.aborted ||
                (error instanceof Error &&
                    'code' in error &&
                    error.code === 'ERR_USE_AFTER_CLOSE')) {
                process.exit(0);
            }
            throw error;
        }
        finally {
            this.readlineInterface.removeListener('SIGINT', onSigint);
        }
    }
    async promptInteractiveForm(message, formSchema, // values are the default, if undefined, one must be provided. You can also use REQUIRED.
    projection) {
        this.display(message);
        const projectionCopy = new projection();
        for (const [key, value] of Object.entries(formSchema)) {
            const response = await this.promptUntilValid(`${key}${value.default ? ` (${value.default.toString()})` : ''}: `, value);
            // TODO: What this error should be? it's a technical implementation error, not domain. Non recoverable
            if (!(key in projectionCopy)) {
                throw new base_exception_1.BaseException({
                    cause: `Schema key ${key} not found in projection`
                });
            }
            Object.assign(projectionCopy, { [key]: response });
        }
        return projectionCopy;
    }
    display(message) {
        console.log(message);
    }
    /**
     * Report a *technical* failure: log the real error (stderr, for the dev) and
     * show the user a curated, non-leaking message. Never pass `error.message`
     * straight to `display` — it can carry internals (contract JSON, stack). Only
     * for technical errors; domain outcomes are shown directly, never logged.
     */
    reportTechnicalError(error, userMessage = 'Algo deu errado. Tente novamente.') {
        logger_util_1.LoggerUtil.error(error);
        this.display(userMessage);
    }
    showError(message) {
        logger_util_1.LoggerUtil.error(message);
    }
    clear() {
        console.clear();
    }
    close() {
        return void 0;
    }
    onEnter() {
        this.clear();
    }
    onExit() {
        return void 0;
    }
    async onUpdateError(error) {
        if (error instanceof base_exception_1.BaseException) {
            logger_util_1.LoggerUtil.error(error);
            this.display(error.message);
            await this.prompt('Pressione ENTER para continuar:');
            return;
        }
        throw error;
    }
    exit(reason) {
        this.isInView = false;
        if (reason) {
            this.showError(reason);
        }
    }
    async start() {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            this.resetState();
            const _ = __addDisposableResource(env_1, this.isRootView
                ? (0, common_util_1.defer)(() => {
                    this.readlineInterface.close();
                })
                : undefined, false);
            try {
                await this.onEnter();
                while (this.isInView) {
                    try {
                        this.clear();
                        await this.update();
                    }
                    catch (error) {
                        await this.onUpdateError(error);
                    }
                }
                await this.onExit();
            }
            catch (error) {
                if (error instanceof Error) {
                    this.showError(error);
                }
                this.display('View exiting with error');
                await this.prompt('Press ENTER to continue:');
            }
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
}
exports.ConsoleView = ConsoleView;
ConsoleView.ABORT_SENTINEL = '\x00ABORT';
//# sourceMappingURL=console.view.js.map