import { ConsoleFormSchema } from '../../@common/view/console.view';
export declare class CreateUserDto {
    login: string;
    senha: string;
    email: string;
    nome: string;
    cpf: string;
    constructor(login: string, senha: string, email: string, nome: string, cpf: string);
    static schema(): ConsoleFormSchema;
}
//# sourceMappingURL=create-user-form.dto.d.ts.map