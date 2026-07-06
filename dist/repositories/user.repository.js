"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async findByLogin(login) {
        const { rows } = await this.pool.query('SELECT * FROM usuario WHERE login = $1', [login]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    async create(user) {
        const { rows: [row] } = await this.pool.query('INSERT INTO usuario (nome, email, login, senha, cpf) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user.nome, user.email, user.login, user.senha, user.cpf]);
        return row;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map