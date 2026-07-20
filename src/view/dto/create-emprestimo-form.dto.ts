import { ConsoleFormSchema } from "../../@common/view/console.view";

export class CreateEmprestimoDto {
  constructor(
    public livroId: number,
    public clienteId: number,
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      livroId: { type: "number", required: true },
      clienteId: { type: "number", required: true },
    };
  }
}
