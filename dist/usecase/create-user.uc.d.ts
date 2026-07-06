import { Usuario } from '../model/user';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../view/dto/create-user-form.dto';
export declare class CreateUserUseCase {
    private readonly repository;
    constructor(repository: UserRepository);
    execute(user: CreateUserDto): Promise<Usuario>;
}
//# sourceMappingURL=create-user.uc.d.ts.map