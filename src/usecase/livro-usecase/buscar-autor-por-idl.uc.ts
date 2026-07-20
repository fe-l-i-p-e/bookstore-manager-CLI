import { Livro } from "../../model/livro/livro";
import { LivroRepository } from "../../repositories/livro.repository";

export class BuscarLivroPorIdUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(id: number): Promise<Livro> {
    const livro = await this.repository.findById(id);

    if (!livro) {
      throw new Error("Livro não encontrado");
    }

    return livro;
  }
}
