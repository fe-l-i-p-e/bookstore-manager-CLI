import { Pool } from 'pg'

import { Emprestimo } from '../model/emprestimo/emprestimo'

export class EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: number): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query<Emprestimo>(
      'SELECT * FROM emprestimos WHERE id = $1',
      [id]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async findAll(): Promise<Emprestimo[]> {
    const { rows } = await this.pool.query<Emprestimo>(
      'SELECT * FROM emprestimos ORDER BY id'
    )

    return rows
  }

  async create(emprestimo: Pick<Emprestimo, 'livroId' | 'clienteId'>): Promise<Emprestimo> {
    const {
      rows: [row]
    } = await this.pool.query<Emprestimo>(
      'INSERT INTO emprestimos (livro_id, cliente_id) VALUES ($1, $2) RETURNING *',
      [emprestimo.livroId, emprestimo.clienteId]
    )

    return row
  }

  async registrarDevolucao(id: number): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query<Emprestimo>(
      'UPDATE emprestimos SET data_devolucao = CURRENT_DATE WHERE id = $1 RETURNING *',
      [id]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM emprestimos WHERE id = $1',
      [id]
    )

    return (result.rowCount ?? 0) > 0
  }
}