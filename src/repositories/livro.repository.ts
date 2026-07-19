import { Pool } from "pg";

import { Livro } from "../model/livro/livro";

export class LivroRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: number): Promise<Livro | null> {
    const { rows } = await this.pool.query<Livro>(
      "SELECT * FROM livros WHERE id = $1",
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAll(): Promise<Livro[]> {
    const { rows } = await this.pool.query<Livro>(
      "SELECT * FROM livros ORDER BY id",
    );

    return rows;
  }

  async create(livro: Omit<Livro, "id">): Promise<Livro> {
    const {
      rows: [row],
    } = await this.pool.query<Livro>(
      "INSERT INTO livros (titulo, quantidade_disponivel, autor_id) VALUES ($1, $2, $3) RETURNING *",
      [livro.titulo, livro.quantidadeDisponivel, livro.autorId],
    );

    return row;
  }

  async update(id: number, livro: Omit<Livro, "id">): Promise<Livro | null> {
    const { rows } = await this.pool.query<Livro>(
      "UPDATE livros SET titulo = $1, quantidade_disponivel = $2, autor_id = $3 WHERE id = $4 RETURNING *",
      [livro.titulo, livro.quantidadeDisponivel, livro.autorId, id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM livros WHERE id = $1", [
      id,
    ]);

    return (result.rowCount ?? 0) > 0;
  }
}
