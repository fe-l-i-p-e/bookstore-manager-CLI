export interface IAutor {
  id?: number;
  nome: string;
  nacionalidade?: string;
}

export class Autor implements IAutor {
  constructor(
    public nome: string,
    public nacionalidade?: string,
    public id?: number,
  ) {}
}
