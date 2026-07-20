import { ConsoleFormSchema } from "../../@common/view/console.view";

export class CreateAutorDto {
  constructor(
    public nome: string,
    public nacionalidade: string,
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      nome: { type: "string", required: true },
      nacionalidade: { type: "string", required: false },
    };
  }
}
