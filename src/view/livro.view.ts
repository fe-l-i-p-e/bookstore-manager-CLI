import { CreateLivroDto } from "./dto/create-livro-form.dto";
import { ConsoleView } from "../@common/view/console.view";
import { Livro } from "../model/livro/livro";
import { ListarAutoresUseCase } from "../usecase/autor-usecase/listar-autores.uc";
import { AtualizarLivroUseCase } from "../usecase/livro-usecase/atualizar-livro.uc";
import { BuscarLivroPorIdUseCase } from "../usecase/livro-usecase/buscar-livro-por-id.uc";
import { CriarLivroUseCase } from "../usecase/livro-usecase/criar-livro.uc";
import { ListarLivrosUseCase } from "../usecase/livro-usecase/listar-livros.uc";
import { RemoverLivroUseCase } from "../usecase/livro-usecase/remover-livro.uc";

export class LivroView extends ConsoleView {
  constructor(
    private readonly criarLivroUc: CriarLivroUseCase,
    private readonly listarLivrosUc: ListarLivrosUseCase,
    private readonly buscarLivroPorIdUc: BuscarLivroPorIdUseCase,
    private readonly atualizarLivroUc: AtualizarLivroUseCase,
    private readonly removerLivroUc: RemoverLivroUseCase,
    private readonly listarAutoresUc: ListarAutoresUseCase,
  ) {
    super(false);
  }

  protected async update(): Promise<void> {
    this.display("========================================");
    this.display("   Gerenciamento de Livros");
    this.display("========================================");
    this.display("1 - Cadastrar livro");
    this.display("2 - Listar livros");
    this.display("3 - Buscar livro por ID");
    this.display("4 - Atualizar livro");
    this.display("5 - Remover livro");
    this.display("0 - Voltar ao menu principal");
    this.display("");

    const opcao = await this.prompt("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await this.cadastrarLivro();
        break;
      case "2":
        await this.listarLivros();
        break;
      case "3":
        await this.buscarLivroPorId();
        break;
      case "4":
        await this.atualizarLivro();
        break;
      case "5":
        await this.removerLivro();
        break;
      case "0":
        this.exit();
        break;
      default:
        this.display("Opção inválida.");
        await this.prompt("Pressione ENTER para continuar...");
    }
  }

  private async exibirAutoresDisponiveis(): Promise<void> {
    const autores = await this.listarAutoresUc.execute();

    if (autores.length === 0) {
      this.display(
        "Nenhum autor cadastrado ainda. Cadastre um autor antes de continuar.",
      );
      return;
    }

    this.display("Autores disponíveis:");
    for (const autor of autores) {
      this.display(`  ID: ${String(autor.id)} | Nome: ${autor.nome}`);
    }
    this.display("");
  }

  private async cadastrarLivro(): Promise<void> {
    await this.exibirAutoresDisponiveis();

    const dto = await this.promptInteractiveForm(
      "Informe os dados do livro",
      CreateLivroDto.schema(),
      CreateLivroDto,
    );

    const livroOrError = await this.criarLivroUc
      .execute(dto)
      .catch((error: unknown) => error as Error);

    if (livroOrError instanceof Error) {
      this.display(livroOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(
      `Livro "${livroOrError.titulo}" cadastrado com sucesso! (ID: ${String(livroOrError.id)})`,
    );
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async listarLivros(): Promise<void> {
    const livros: Livro[] = await this.listarLivrosUc.execute();

    if (livros.length === 0) {
      this.display("Nenhum livro cadastrado.");
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("");
    for (const livro of livros) {
      this.display(
        `ID: ${String(livro.id)} | Título: ${livro.titulo} | Disponível: ${String(livro.quantidadeDisponivel)} | Autor ID: ${String(livro.autorId)}`,
      );
    }

    this.display("");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async buscarLivroPorId(): Promise<void> {
    const id = await this.promptNumero("Informe o ID do livro: ");

    const livroOrError = await this.buscarLivroPorIdUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (livroOrError instanceof Error) {
      this.display(livroOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(
      `ID: ${String(livroOrError.id)} | Título: ${livroOrError.titulo} | Disponível: ${String(livroOrError.quantidadeDisponivel)} | Autor ID: ${String(livroOrError.autorId)}`,
    );
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async atualizarLivro(): Promise<void> {
    const id = await this.promptNumero(
      "Informe o ID do livro que deseja atualizar: ",
    );

    await this.exibirAutoresDisponiveis();

    const dto = await this.promptInteractiveForm(
      "Informe os novos dados do livro",
      CreateLivroDto.schema(),
      CreateLivroDto,
    );

    const livroOrError = await this.atualizarLivroUc
      .execute(id, dto)
      .catch((error: unknown) => error as Error);

    if (livroOrError instanceof Error) {
      this.display(livroOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("Livro atualizado com sucesso!");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async removerLivro(): Promise<void> {
    const id = await this.promptNumero(
      "Informe o ID do livro que deseja remover: ",
    );

    const resultado = await this.removerLivroUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (resultado instanceof Error) {
      this.display(resultado.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("Livro removido com sucesso!");
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
