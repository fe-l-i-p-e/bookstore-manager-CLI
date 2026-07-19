export interface IEmprestimo {
  id?: number;
  livroId: number;
  clienteId: number;
  dataEmprestimo?: Date;
  dataDevolucao?: Date | null;
}

export class Emprestimo implements IEmprestimo {
  constructor(
    public livroId: number,
    public clienteId: number,
    public dataEmprestimo?: Date,
    public dataDevolucao?: Date | null,
    public id?: number,
  ) {}
}
