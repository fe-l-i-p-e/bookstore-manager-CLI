export interface ILivro {
    id?: number;
    titulo: string;
    quantidadeDisponivel: number;
    autorId: number;
}


export class Livro implements ILivro {
    constructor(
        public titulo: string,
        public quantidadeDisponivel: number,
        public autorId: number,
        public id?: number
    ) {}
}