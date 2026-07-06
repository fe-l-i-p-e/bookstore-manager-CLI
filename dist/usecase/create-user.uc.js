"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
class CreateUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(user) {
        const existingUser = await this.repository.findByLogin(user.login);
        if (existingUser) {
            throw new Error('Usuário já cadastrado');
        }
        return await this.repository.create(user);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
//# sourceMappingURL=create-user.uc.js.map