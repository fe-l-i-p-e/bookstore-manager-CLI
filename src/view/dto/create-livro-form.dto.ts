import { ConsoleFormSchema } from "../../@common/view/console.view";

export class CreateLivroDto {
  constructor(
    public titulo: string,
    public quantidadeDisponivel: number,
    public autorId: number,
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      titulo: { type: "string", required: true },
      quantidadeDisponivel: { type: "number", required: true },
      autorId: { type: "number", required: true },
    };
  }
}
