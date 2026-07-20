import { AutorRepository } from "../../repositories/autor.repository";

export class RemoverAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(id: number): Promise<void> {
    const autorExistente = await this.repository.findById(id);

    if (!autorExistente) {
      throw new Error("Autor não encontrado");
    }

    try {
      await this.repository.delete(id);
    } catch {
      throw new Error(
        "Não é possível remover um autor que possui livros cadastrados",
      );
    }
  }
}
