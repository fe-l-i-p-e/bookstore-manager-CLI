import { ConsoleView } from "../@common/view/console.view";
import { CriarClienteUseCase } from "../usecase/criar-cliente";
import { CreateAutorDto } from "./dto/create-autor-form.dto";
export class MainView extends ConsoleView {
  constructor(private readonly createUserUc: CriarClienteUseCase) {
    super(true);
  }

  protected async update(): Promise<void> {
    this.display("========================================");
    this.display("   Bem-vindo ao Acervo CLI              ");
    this.display("   Sistema de Gestão de Biblioteca      ");
    this.display("========================================");
    this.display("");

    const createUserDto = await this.promptInteractiveForm(
      `Informe os dados do usuário`,
      CreateAutorDto.schema(),
      CreateAutorDto,
    );

    const userOrError = await this.createUserUc
      .execute(createUserDto)
      .catch((error: unknown) => error as Error);

    if (userOrError instanceof Error) {
      this.reportTechnicalError(userOrError);
      await this.prompt("Pressione ENTER para sair...");
      return;
    }

    await this.prompt(
      `Usuario ${JSON.stringify(userOrError)} criado com sucesso!`,
    );
    await this.prompt("Pressione ENTER para sair...");
    this.exit();
  }
}
