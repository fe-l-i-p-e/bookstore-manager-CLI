import { ClienteRepository } from "../../repositories/client.repository";

export class RemoverClienteUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async execute(id: number): Promise<void> {
    const removido = await this.repository.delete(id);

    if (!removido) {
      throw new Error("Cliente não encontrado");
    }
  }
}
