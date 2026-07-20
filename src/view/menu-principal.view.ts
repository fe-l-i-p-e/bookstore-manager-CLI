import { AutorView } from "./autor.view";
import { ClienteView } from "./cliente.view";
import { EmprestimoView } from "./emprestimo.view";
import { LivroView } from "./livro.view";
import { ConsoleView } from "../@common/view/console.view";

export class MenuPrincipalView extends ConsoleView {
  constructor(
    private readonly autorView: AutorView,
    private readonly livroView: LivroView,
    private readonly clienteView: ClienteView,
    private readonly emprestimoView: EmprestimoView,
  ) {
    super(true);
  }

  protected async update(): Promise<void> {
    this.display("========================================");
    this.display("   Bem-vindo ao BookStore Manager CLI");
    this.display("   Sistema de Gestão de Livraria");
    this.display("========================================");
    this.display("1 - Autores");
    this.display("2 - Livros");
    this.display("3 - Clientes");
    this.display("4 - Empréstimos");
    this.display("0 - Sair");
    this.display("");

    const opcao = await this.prompt("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await this.autorView.start();
        break;
      case "2":
        await this.livroView.start();
        break;
      case "3":
        await this.clienteView.start();
        break;
      case "4":
        await this.emprestimoView.start();
        break;
      case "0":
        this.exit();
        break;
      default:
        this.display("Opção inválida.");
        await this.prompt("Pressione ENTER para continuar...");
    }
  }
}
