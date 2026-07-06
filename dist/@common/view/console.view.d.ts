export type ConsoleFormSchema = Record<string, InteractiveFormKey>;
interface InteractiveFormKey {
    type: 'string' | 'number' | 'boolean';
    required?: boolean;
    default?: string | number | boolean;
}
export declare abstract class ConsoleView {
    private readonly isRootView;
    protected static readonly ABORT_SENTINEL = "\0ABORT";
    protected isInView: boolean;
    private aborted;
    private readlineInterface;
    constructor(isRootView?: boolean);
    private resetState;
    private promptUntilValid;
    protected abstract update(): void | Promise<void>;
    protected prompt(message: string): Promise<string>;
    protected promptInteractiveForm<T extends object>(message: string, formSchema: Record<string, InteractiveFormKey>, // values are the default, if undefined, one must be provided. You can also use REQUIRED.
    projection: new (...args: any) => T): Promise<T>;
    protected display(message: string): void;
    /**
     * Report a *technical* failure: log the real error (stderr, for the dev) and
     * show the user a curated, non-leaking message. Never pass `error.message`
     * straight to `display` — it can carry internals (contract JSON, stack). Only
     * for technical errors; domain outcomes are shown directly, never logged.
     */
    protected reportTechnicalError(error: unknown, userMessage?: string): void;
    protected showError(message: string | Error): void;
    protected clear(): void;
    protected close(): void;
    protected onEnter(): void | Promise<void>;
    protected onExit(): void | Promise<void>;
    protected onUpdateError(error: unknown): Promise<void>;
    protected exit(reason?: Error): void;
    start(): Promise<void>;
}
export {};
//# sourceMappingURL=console.view.d.ts.map