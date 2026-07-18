import { Cliente } from "../model/cliente/modelCliente";
import { ClienteRepository } from "../repositories/client.repository";
import { CreateClienteDto } from "../view/dto/create-cliente-form.dto";

export class CriarClienteUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async execute(cliente: CreateClienteDto): Promise<Cliente> {
    const existingCliente = await this.repository.findByEmail(cliente.email);

    if (existingCliente) {
      throw new Error("Já existe um cliente cadastrado com esse e-mail");
    }

    return await this.repository.create(cliente);
  }
}
