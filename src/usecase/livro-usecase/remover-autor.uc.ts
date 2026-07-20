import { LivroRepository } from "../../repositories/livro.repository";

export class RemoverLivroUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(id: number): Promise<void> {
    const livroExistente = await this.repository.findById(id);

    if (!livroExistente) {
      throw new Error("Livro não encontrado");
    }

    try {
      await this.repository.delete(id);
    } catch {
      throw new Error(
        "Não é possível remover um livro que possui empréstimos registrados",
      );
    }
  }
}
