import { ConsoleFormSchema } from '../../@common/view/console.view'

export class CreateEmprestimoDto {
constructor(
        public livroId: number,
        public clienteId: number,
        public dataEmprestimo?: Date,
        public dataDevolucao?: Date | null,
        public id?: number
    ) {}


  static schema(): ConsoleFormSchema {
    return {
      livroId: { type: 'number', required: true },
      clienteId: { type: 'number', required: true },
      dataEmprestimo: { type: 'string', required: false }
    }
  }
}