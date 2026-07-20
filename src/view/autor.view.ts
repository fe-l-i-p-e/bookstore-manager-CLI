import { CreateAutorDto } from "./dto/create-autor-form.dto";
import { ConsoleView } from "../@common/view/console.view";
import { AtualizarAutorUseCase } from "../usecase/autor-usecase/atualizar-autor.uc";
import { BuscarAutorPorIdUseCase } from "../usecase/autor-usecase/buscar-autor-por-idl.uc";
import { CriarAutorUseCase } from "../usecase/autor-usecase/criar-autor.uc";
import { ListarAutoresUseCase } from "../usecase/autor-usecase/listar-autor.uc";
import { RemoverAutorUseCase } from "../usecase/autor-usecase/remover-autor.uc";

export class AutorView extends ConsoleView {
  constructor(
    private readonly criarAutorUc: CriarAutorUseCase,
    private readonly listarAutoresUc: ListarAutoresUseCase,
    private readonly buscarAutorPorIdUc: BuscarAutorPorIdUseCase,
    private readonly atualizarAutorUc: AtualizarAutorUseCase,
    private readonly removerAutorUc: RemoverAutorUseCase,
  ) {
    super(false);
  }

  protected async update(): Promise<void> {
    this.display("========================================");
    this.display("   Gerenciamento de Autores");
    this.display("========================================");
    this.display("1 - Cadastrar autor");
    this.display("2 - Listar autores");
    this.display("3 - Buscar autor por ID");
    this.display("4 - Atualizar autor");
    this.display("5 - Remover autor");
    this.display("0 - Voltar ao menu principal");
    this.display("");

    const opcao = await this.prompt("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await this.cadastrarAutor();
        break;
      case "2":
        await this.listarAutores();
        break;
      case "3":
        await this.buscarAutorPorId();
        break;
      case "4":
        await this.atualizarAutor();
        break;
      case "5":
        await this.removerAutor();
        break;
      case "0":
        this.exit();
        break;
      default:
        this.display("Opção inválida.");
        await this.prompt("Pressione ENTER para continuar...");
    }
  }

  private async cadastrarAutor(): Promise<void> {
    const dto = await this.promptInteractiveForm(
      "Informe os dados do autor",
      CreateAutorDto.schema(),
      CreateAutorDto,
    );

    const autorOrError = await this.criarAutorUc
      .execute(dto)
      .catch((error: unknown) => error as Error);

    if (autorOrError instanceof Error) {
      this.display(autorOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(
      `Autor "${autorOrError.nome}" cadastrado com sucesso! (ID: ${autorOrError.id !== undefined ? autorOrError.id.toString() : ""})`,
    );
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async listarAutores(): Promise<void> {
    const autores = await this.listarAutoresUc.execute();

    if (autores.length === 0) {
      this.display("Nenhum autor cadastrado.");
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("");
    for (const autor of autores) {
      this.display(
        `ID: ${String(autor.id)} | Nome: ${autor.nome} | Nacionalidade: ${autor.nacionalidade ?? "-"}`,
      );
    }
    this.display("");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async buscarAutorPorId(): Promise<void> {
    const id = await this.promptNumero("Informe o ID do autor: ");

    const autorOrError = await this.buscarAutorPorIdUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (autorOrError instanceof Error) {
      this.display(autorOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(
      `ID: ${String(autorOrError.id)} | Nome: ${autorOrError.nome} | Nacionalidade: ${autorOrError.nacionalidade ?? "-"}`,
    );
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async atualizarAutor(): Promise<void> {
    const id = await this.promptNumero(
      "Informe o ID do autor que deseja atualizar: ",
    );

    const dto = await this.promptInteractiveForm(
      "Informe os novos dados do autor",
      CreateAutorDto.schema(),
      CreateAutorDto,
    );

    const autorOrError = await this.atualizarAutorUc
      .execute(id, dto)
      .catch((error: unknown) => error as Error);

    if (autorOrError instanceof Error) {
      this.display(autorOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(`Autor atualizado com sucesso!`);
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async removerAutor(): Promise<void> {
    const id = await this.promptNumero(
      "Informe o ID do autor que deseja remover: ",
    );

    const resultado = await this.removerAutorUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (resultado instanceof Error) {
      this.display(resultado.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("Autor removido com sucesso!");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async promptNumero(mensagem: string): Promise<number> {
    for (;;) {
      const resposta = await this.prompt(mensagem);
      const numero = Number(resposta);

      if (!Number.isNaN(numero)) {
        return numero;
      }

      this.display("Digite um número válido.");
    }
  }
}
