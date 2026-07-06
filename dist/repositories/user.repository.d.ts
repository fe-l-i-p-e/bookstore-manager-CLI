import { Pool } from 'pg';
import { Usuario } from '../model/user';
export declare class UserRepository {
    private readonly pool;
    constructor(pool: Pool);
    findByLogin(login: string): Promise<Usuario | null>;
    create(user: Omit<Usuario, 'id'>): Promise<Usuario>;
}
//# sourceMappingURL=user.repository.d.ts.map