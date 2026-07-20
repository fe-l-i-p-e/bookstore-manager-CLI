import { Autor } from "../../model/autor/modelAutor";
import { AutorRepository } from "../../repositories/autor.repository";

export class ListarAutoresUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(): Promise<Autor[]> {
    return await this.repository.findAll();
  }
}
