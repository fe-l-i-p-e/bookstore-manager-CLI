import { Pool } from "pg";

import { Cliente } from "../model/cliente/modelCliente";

export class ClienteRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: number): Promise<Cliente | null> {
    const { rows } = await this.pool.query<Cliente>(
      "SELECT * FROM clientes WHERE id = $1",
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const { rows } = await this.pool.query<Cliente>(
      "SELECT * FROM clientes WHERE email = $1",
      [email],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAll(): Promise<Cliente[]> {
    const { rows } = await this.pool.query<Cliente>(
      "SELECT * FROM clientes ORDER BY id",
    );

    return rows;
  }

  async create(
    cliente: Omit<Cliente, "id" | "dataCadastro">,
  ): Promise<Cliente> {
    const {
      rows: [row],
    } = await this.pool.query<Cliente>(
      "INSERT INTO clientes (nome, cpf, email) VALUES ($1, $2, $3) RETURNING *",
      [cliente.nome, cliente.cpf, cliente.email],
    );

    return row;
  }

  async update(
    id: number,
    cliente: Omit<Cliente, "id" | "dataCadastro">,
  ): Promise<Cliente | null> {
    const { rows } = await this.pool.query<Cliente>(
      "UPDATE clientes SET nome = $1, cpf = $2, email = $3 WHERE id = $4 RETURNING *",
      [cliente.nome, cliente.cpf, cliente.email, id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM clientes WHERE id = $1", [
      id,
    ]);

    return (result.rowCount ?? 0) > 0;
  }
}
