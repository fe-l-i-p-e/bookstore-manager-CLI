import { Autor } from "../../model/autor/modelAutor";
import { AutorRepository } from "../../repositories/autor.repository";
import { CreateAutorDto } from "../../view/dto/create-autor-form.dto";

export class AtualizarAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(id: number, dados: CreateAutorDto): Promise<Autor> {
    const autor = await this.repository.findById(id);

    if (!autor) {
      throw new Error("Autor não encontrado");
    }
    const atualizado = await this.repository.update(id, dados);

    if (!atualizado) {
      throw new Error("Não foi possivel atualizar o autor");
    }

    return atualizado;
  }
}
