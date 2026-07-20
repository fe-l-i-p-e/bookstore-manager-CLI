import { Emprestimo } from "../../model/emprestimo/emprestimo";
import { ClienteRepository } from "../../repositories/client.repository";
import { EmprestimoRepository } from "../../repositories/emprestimo.repository";
import { LivroRepository } from "../../repositories/livro.repository";
import { CreateEmprestimoDto } from "../../view/dto/create-emprestimo-form.dto";

export class CriarEmprestimoUseCase {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly livroRepository: LivroRepository,
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async execute(dados: CreateEmprestimoDto): Promise<Emprestimo> {
    const livro = await this.livroRepository.findById(dados.livroId);

    if (!livro) {
      throw new Error("Livro não encontrado");
    }

    const cliente = await this.clienteRepository.findById(dados.clienteId);

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    if (livro.quantidadeDisponivel <= 0) {
      throw new Error("Não há exemplares disponíveis desse livro no momento");
    }

    const emprestimo = await this.emprestimoRepository.create(dados);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.livroRepository.update(livro.id!, {
      titulo: livro.titulo,
      quantidadeDisponivel: livro.quantidadeDisponivel - 1,
      autorId: livro.autorId,
    });

    return emprestimo;
  }
}
