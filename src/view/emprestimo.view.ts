import { CreateEmprestimoDto } from "./dto/create-emprestimo-form.dto";
import { ConsoleView } from "../@common/view/console.view";
import { Emprestimo } from "../model/emprestimo/emprestimo";
import { ListarClientesUseCase } from "../usecase/cliente-usecase/listar-clientes.uc";
import { BuscarEmprestimoPorIdUseCase } from "../usecase/emprestimos-usecase/buscar-emprestimo.uc";
import { CriarEmprestimoUseCase } from "../usecase/emprestimos-usecase/criar-emprestimo.uc";
import { ListarEmprestimosUseCase } from "../usecase/emprestimos-usecase/listar-emprestimos.uc";
import { RegistrarDevolucaoUseCase } from "../usecase/emprestimos-usecase/registrar-devolucao-emprestimo.uc";
import { ListarLivrosUseCase } from "../usecase/livro-usecase/listar-livros.uc";

export class EmprestimoView extends ConsoleView {
  constructor(
    private readonly criarEmprestimoUc: CriarEmprestimoUseCase,
    private readonly listarEmprestimosUc: ListarEmprestimosUseCase,
    private readonly buscarEmprestimoPorIdUc: BuscarEmprestimoPorIdUseCase,
    private readonly registrarDevolucaoUc: RegistrarDevolucaoUseCase,
    private readonly listarLivrosUc: ListarLivrosUseCase,
    private readonly listarClientesUc: ListarClientesUseCase,
  ) {
    super(false);
  }

  protected async update(): Promise<void> {
    this.display("========================================");
    this.display("   Gerenciamento de Empréstimos");
    this.display("========================================");
    this.display("1 - Registrar empréstimo");
    this.display("2 - Registrar devolução");
    this.display("3 - Listar empréstimos");
    this.display("4 - Buscar empréstimo por ID");
    this.display("0 - Voltar ao menu principal");
    this.display("");

    const opcao = await this.prompt("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await this.registrarEmprestimo();
        break;
      case "2":
        await this.registrarDevolucao();
        break;
      case "3":
        await this.listarEmprestimos();
        break;
      case "4":
        await this.buscarEmprestimoPorId();
        break;
      case "0":
        this.exit();
        break;
      default:
        this.display("Opção inválida.");
        await this.prompt("Pressione ENTER para continuar...");
    }
  }

  private async exibirLivrosDisponiveis(): Promise<void> {
    const livros = await this.listarLivrosUc.execute();

    if (livros.length === 0) {
      this.display("Nenhum livro cadastrado ainda.");
      return;
    }

    this.display("Livros disponíveis:");
    for (const livro of livros) {
      this.display(
        `  ID: ${String(livro.id)} | Título: ${livro.titulo} | Disponível: ${String(livro.quantidadeDisponivel)}`,
      );
    }
    this.display("");
  }

  private async exibirClientesCadastrados(): Promise<void> {
    const clientes = await this.listarClientesUc.execute();

    if (clientes.length === 0) {
      this.display("Nenhum cliente cadastrado ainda.");
      return;
    }

    this.display("Clientes cadastrados:");
    for (const cliente of clientes) {
      this.display(`  ID: ${String(cliente.id)} | Nome: ${cliente.nome}`);
    }
    this.display("");
  }

  private async registrarEmprestimo(): Promise<void> {
    await this.exibirLivrosDisponiveis();
    await this.exibirClientesCadastrados();

    const dto = await this.promptInteractiveForm(
      "Informe os dados do empréstimo",
      CreateEmprestimoDto.schema(),
      CreateEmprestimoDto,
    );

    const emprestimoOrError = await this.criarEmprestimoUc
      .execute(dto)
      .catch((error: unknown) => error as Error);

    if (emprestimoOrError instanceof Error) {
      this.display(emprestimoOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(
      `Empréstimo registrado com sucesso! (ID: ${String(emprestimoOrError.id)})`,
    );
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async registrarDevolucao(): Promise<void> {
    const id = await this.promptNumero(
      "Informe o ID do empréstimo que deseja devolver: ",
    );

    const resultadoOrError = await this.registrarDevolucaoUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (resultadoOrError instanceof Error) {
      this.display(resultadoOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("Devolução registrada com sucesso!");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async listarEmprestimos(): Promise<void> {
    const emprestimos: Emprestimo[] = await this.listarEmprestimosUc.execute();

    if (emprestimos.length === 0) {
      this.display("Nenhum empréstimo registrado.");
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("");
    for (const emprestimo of emprestimos) {
      const status = emprestimo.dataDevolucao ? "Devolvido" : "Em aberto";
      this.display(
        `ID: ${String(emprestimo.id)} | Livro ID: ${String(emprestimo.livroId)} | Cliente ID: ${String(emprestimo.clienteId)} | Status: ${status}`,
      );
    }

    this.display("");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async buscarEmprestimoPorId(): Promise<void> {
    const id = await this.promptNumero("Informe o ID do empréstimo: ");

    const emprestimoOrError = await this.buscarEmprestimoPorIdUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (emprestimoOrError instanceof Error) {
      this.display(emprestimoOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    const status = emprestimoOrError.dataDevolucao ? "Devolvido" : "Em aberto";
    this.display(
      `ID: ${String(emprestimoOrError.id)} | Livro ID: ${String(emprestimoOrError.livroId)} | Cliente ID: ${String(emprestimoOrError.clienteId)} | Status: ${status}`,
    );
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
