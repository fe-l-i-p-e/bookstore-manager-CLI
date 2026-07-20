import { Livro } from "../../model/livro/livro";
import { AutorRepository } from "../../repositories/autor.repository";
import { LivroRepository } from "../../repositories/livro.repository";
import { CreateLivroDto } from "../../view/dto/create-livro-form.dto";

export class CriarLivroUseCase {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository,
  ) {}

  async execute(livro: CreateLivroDto): Promise<Livro> {
    const autorExiste = await this.autorRepository.findById(livro.autorId);

    if (!autorExiste) {
      throw new Error(
        "Autor não encontrado. Cadastre o autor antes de vincular um livro a ele.",
      );
    }

    return await this.livroRepository.create(livro);
  }
}
