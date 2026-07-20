import { Emprestimo } from "../../model/emprestimo/emprestimo";
import { EmprestimoRepository } from "../../repositories/emprestimo.repository";

export class BuscarEmprestimoPorIdUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(id: number): Promise<Emprestimo> {
    const emprestimo = await this.repository.findById(id);

    if (!emprestimo) {
      throw new Error("Empréstimo não encontrado");
    }

    return emprestimo;
  }
}
