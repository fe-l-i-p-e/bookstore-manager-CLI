import { Emprestimo } from "../../model/emprestimo/emprestimo";
import { EmprestimoRepository } from "../../repositories/emprestimo.repository";

export class ListarEmprestimosUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(): Promise<Emprestimo[]> {
    return await this.repository.findAll();
  }
}
