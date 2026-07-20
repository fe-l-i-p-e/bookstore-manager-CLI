import { Emprestimo } from "../../model/emprestimo/emprestimo";
import { EmprestimoRepository } from "../../repositories/emprestimo.repository";
import { LivroRepository } from "../../repositories/livro.repository";

export class RegistrarDevolucaoUseCase {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly livroRepository: LivroRepository,
  ) {}

  async execute(emprestimoId: number): Promise<Emprestimo> {
    const emprestimo = await this.emprestimoRepository.findById(emprestimoId);

    if (!emprestimo) {
      throw new Error("Empréstimo não encontrado");
    }

    if (emprestimo.dataDevolucao) {
      throw new Error("Este empréstimo já foi devolvido");
    }

    const livro = await this.livroRepository.findById(emprestimo.livroId);

    if (!livro) {
      throw new Error("Livro vinculado a este empréstimo não foi encontrado");
    }

    const atualizado =
      await this.emprestimoRepository.registrarDevolucao(emprestimoId);

    if (!atualizado) {
      throw new Error("Não foi possível registrar a devolução");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.livroRepository.update(livro.id!, {
      titulo: livro.titulo,
      quantidadeDisponivel: livro.quantidadeDisponivel + 1,
      autorId: livro.autorId,
    });

    return atualizado;
  }
}
