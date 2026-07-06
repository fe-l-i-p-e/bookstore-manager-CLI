"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainView = void 0;
const create_user_form_dto_1 = require("./dto/create-user-form.dto");
const console_view_1 = require("../@common/view/console.view");
class MainView extends console_view_1.ConsoleView {
    constructor(createUserUc) {
        super(true);
        this.createUserUc = createUserUc;
    }
    async update() {
        this.display('========================================');
        this.display('   Bem-vindo ao Acervo CLI              ');
        this.display('   Sistema de Gestão de Biblioteca      ');
        this.display('========================================');
        this.display('');
        const createUserDto = await this.promptInteractiveForm(`Informe os dados do usuário`, create_user_form_dto_1.CreateUserDto.schema(), create_user_form_dto_1.CreateUserDto);
        const userOrError = await this.createUserUc
            .execute(createUserDto)
            .catch((error) => error);
        if (userOrError instanceof Error) {
            this.reportTechnicalError(userOrError);
            await this.prompt('Pressione ENTER para sair...');
            return;
        }
        await this.prompt(`Usuario ${JSON.stringify(userOrError)} criado com sucesso!`);
        await this.prompt('Pressione ENTER para sair...');
        this.exit();
    }
}
exports.MainView = MainView;
//# sourceMappingURL=main.view.js.map