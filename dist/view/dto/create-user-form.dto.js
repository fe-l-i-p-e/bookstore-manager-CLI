"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
class CreateUserDto {
    constructor(login, senha, email, nome, cpf) {
        this.login = login;
        this.senha = senha;
        this.email = email;
        this.nome = nome;
        this.cpf = cpf;
    }
    static schema() {
        return {
            nome: { type: 'string', required: true },
            email: { type: 'string', required: true },
            cpf: { type: 'string', required: true },
            login: { type: 'string', required: true },
            senha: { type: 'string', required: true }
        };
    }
}
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user-form.dto.js.map