import { Autor } from "../../model/autor/modelAutor";
import { AutorRepository } from "../../repositories/autor.repository";
import { CreateAutorDto } from "../../view/dto/create-autor-form.dto";

export class CriarAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(autor: CreateAutorDto): Promise<Autor> {
    if (!autor.nome || autor.nome.trim().length === 0) {
      throw new Error("O nome do autor é obrigatório");
    }

    return await this.repository.create(autor);
  }
}
