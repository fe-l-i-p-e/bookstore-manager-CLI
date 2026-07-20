import { Autor } from "../../model/autor/modelAutor";
import { AutorRepository } from "../../repositories/autor.repository";
import { CreateAutorDto } from "../../view/dto/create-autor-form.dto";

export class AtualizarAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(id: number, dados: CreateAutorDto): Promise<Autor> {
    const autorExistente = await this.repository.findById(id);

    if (!autorExistente) {
      throw new Error("Autor não encontrado");
    }

    const atualizado = await this.repository.update(id, dados);

    if (!atualizado) {
      throw new Error("Não foi possível atualizar o autor");
    }

    return atualizado;
  }
}
