import { ConsoleFormSchema } from "../../@common/view/console.view";

export class CreateClienteDto {
  constructor(
    public nome: string,
    public cpf: string,
    public email: string,
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      nome: { type: "string", required: true },
      cpf: { type: "string", required: false },
      email: { type: "string", required: true },
    };
  }
}
