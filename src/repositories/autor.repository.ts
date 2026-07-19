import { Pool } from "pg";

import { Autor } from "../model/autor/modelAutor";

export class AutorRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: number): Promise<Autor | null> {
    const { rows } = await this.pool.query<Autor>(
      "SELECT * FROM autores WHERE id = $1",
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findAll(): Promise<Autor[]> {
    const { rows } = await this.pool.query<Autor>(
      "SELECT * FROM autores ORDER BY id",
    );

    return rows;
  }

  async create(autor: Omit<Autor, "id">): Promise<Autor> {
    const {
      rows: [row],
    } = await this.pool.query<Autor>(
      "INSERT INTO autores (nome, nacionalidade) VALUES ($1, $2) RETURNING *",
      [autor.nome, autor.nacionalidade],
    );

    return row;
  }

  async update(id: number, autor: Omit<Autor, "id">): Promise<Autor | null> {
    const { rows } = await this.pool.query<Autor>(
      "UPDATE autores SET nome = $1, nacionalidade = $2 WHERE id = $3 RETURNING *",
      [autor.nome, autor.nacionalidade, id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM autores WHERE id = $1", [
      id,
    ]);

    return (result.rowCount ?? 0) > 0;
  }
}
