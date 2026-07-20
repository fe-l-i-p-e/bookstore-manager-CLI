import { Livro } from "../../model/livro/livro";
import { LivroRepository } from "../../repositories/livro.repository";

export class ListarLivrosUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(): Promise<Livro[]> {
    return await this.repository.findAll();
  }
}
