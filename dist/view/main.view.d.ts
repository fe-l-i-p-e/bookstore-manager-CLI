import { ConsoleView } from '../@common/view/console.view';
import { CreateUserUseCase } from '../usecase/create-user.uc';
export declare class MainView extends ConsoleView {
    private readonly createUserUc;
    constructor(createUserUc: CreateUserUseCase);
    protected update(): Promise<void>;
}
//# sourceMappingURL=main.view.d.ts.map