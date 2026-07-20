import { Cliente } from "../../model/cliente/modelCliente";
import { ClienteRepository } from "../../repositories/client.repository";
import { CreateClienteDto } from "../../view/dto/create-cliente-form.dto";

export class AtualizarClienteUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async execute(id: number, dados: CreateClienteDto): Promise<Cliente> {
    const clienteExistente = await this.repository.findById(id);

    if (!clienteExistente) {
      throw new Error("Cliente não encontrado");
    }

    const atualizado = await this.repository.update(id, dados);

    if (!atualizado) {
      throw new Error("Não foi possivel atualizar o cliente");
    }
    return atualizado;
  }
}
