import { Cliente } from "../../model/cliente/modelCliente";
import { ClienteRepository } from "../../repositories/client.repository";

export class BuscarClientePorIdUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async execute(id: number): Promise<Cliente> {
    const cliente = await this.repository.findById(id);

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    return cliente;
  }
}
