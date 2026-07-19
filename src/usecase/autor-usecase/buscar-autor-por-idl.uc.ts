import { Autor } from "../../model/autor/modelAutor";
import { AutorRepository } from "../../repositories/autor.repository";

export class BuscarAutorPorIdUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(id: number): Promise<Autor> {
    const autor = await this.repository.findById(id);

    if (!autor) {
      throw new Error("Autor não encontrado");
    }

    return autor;
  }
}
