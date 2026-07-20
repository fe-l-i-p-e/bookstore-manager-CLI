import { Livro } from "../../model/livro/livro";
import { AutorRepository } from "../../repositories/autor.repository";
import { LivroRepository } from "../../repositories/livro.repository";
import { CreateLivroDto } from "../../view/dto/create-livro-form.dto";
export class AtualizarLivroUseCase {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository,
  ) {}

  async execute(id: number, dados: CreateLivroDto): Promise<Livro> {
    const livroExistente = await this.livroRepository.findById(id);

    if (!livroExistente) {
      throw new Error("Livro não encontrado");
    }

    const autorExiste = await this.autorRepository.findById(dados.autorId);

    if (!autorExiste) {
      throw new Error(
        "Autor não encontrado. Cadastre o autor antes de vincular um livro a ele.",
      );
    }

    const atualizado = await this.livroRepository.update(id, dados);

    if (!atualizado) {
      throw new Error("Não foi possível atualizar o livro");
    }

    return atualizado;
  }
}
