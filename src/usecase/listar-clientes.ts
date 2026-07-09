import { Cliente } from '../model/cliente/modelCliente'
import { ClienteRepository } from '../repositories/client.repository'

export class ListarClientesUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async execute(): Promise<Cliente[]> {
    return await this.repository.findAll()
  }
}