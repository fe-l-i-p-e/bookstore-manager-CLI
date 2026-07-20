import { AutorRepository } from "../../repositories/autor.repository";

export class RemoverAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(id: number): Promise<void> {
    const removido = await this.repository.delete(id);

    if (!removido) {
      throw new Error("Autor não encontrado");
    }
  }
}
