export interface ICliente {
    id?: number;
    nome: string;
    cpf?: string;
    email?: string;
    dataCadastro?: Date;
}

export class Cliente implements ICliente {
    constructor(
        public nome: string,
        public cpf?: string,
        public email?: string,
        public dataCadastro?: Date,
        public id?: number
    ) {}
}