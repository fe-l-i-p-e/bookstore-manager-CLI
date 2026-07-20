import { CreateClienteDto } from "./dto/create-cliente-form.dto";
import { ConsoleView } from "../@common/view/console.view";
import { Cliente } from "../model/cliente/modelCliente";
import { AtualizarClienteUseCase } from "../usecase/cliente-usecase/atualizar-cliente.uc";
import { BuscarClientePorIdUseCase } from "../usecase/cliente-usecase/buscar-cliente-por-id.uc";
import { CriarClienteUseCase } from "../usecase/cliente-usecase/criar-cliente.uc";
import { ListarClientesUseCase } from "../usecase/cliente-usecase/listar-clientes.uc";
import { RemoverClienteUseCase } from "../usecase/cliente-usecase/remover-cliente.uc";

export class ClienteView extends ConsoleView {
  constructor(
    private readonly criarClienteUc: CriarClienteUseCase,
    private readonly listarClientesUc: ListarClientesUseCase,
    private readonly buscarClientePorIdUc: BuscarClientePorIdUseCase,
    private readonly atualizarClienteUc: AtualizarClienteUseCase,
    private readonly removerClienteUc: RemoverClienteUseCase,
  ) {
    super(false);
  }

  protected async update(): Promise<void> {
    this.display("========================================");
    this.display("   Gerenciamento de Clientes");
    this.display("========================================");
    this.display("1 - Cadastrar cliente");
    this.display("2 - Listar clientes");
    this.display("3 - Buscar cliente por ID");
    this.display("4 - Atualizar cliente");
    this.display("5 - Remover cliente");
    this.display("0 - Voltar ao menu principal");
    this.display("");

    const opcao = await this.prompt("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await this.cadastrarCliente();
        break;
      case "2":
        await this.listarClientes();
        break;
      case "3":
        await this.buscarClientePorId();
        break;
      case "4":
        await this.atualizarCliente();
        break;
      case "5":
        await this.removerCliente();
        break;
      case "0":
        this.exit();
        break;
      default:
        this.display("Opção inválida.");
        await this.prompt("Pressione ENTER para continuar...");
    }
  }

  private async cadastrarCliente(): Promise<void> {
    const dto = await this.promptInteractiveForm(
      "Informe os dados do cliente",
      CreateClienteDto.schema(),
      CreateClienteDto,
    );

    const clienteOrError = await this.criarClienteUc
      .execute(dto)
      .catch((error: unknown) => error as Error);

    if (clienteOrError instanceof Error) {
      this.display(clienteOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(
      `Cliente "${clienteOrError.nome}" cadastrado com sucesso! (ID: ${String(clienteOrError.id)})`,
    );
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async listarClientes(): Promise<void> {
    const clientes: Cliente[] = await this.listarClientesUc.execute();

    if (clientes.length === 0) {
      this.display("Nenhum cliente cadastrado.");
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("");
    for (const cliente of clientes) {
      this.display(
        `ID: ${String(cliente.id)} | Nome: ${cliente.nome} | E-mail: ${cliente.email ?? "-"} | CPF: ${cliente.cpf ?? "-"}`,
      );
    }

    this.display("");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async buscarClientePorId(): Promise<void> {
    const id = await this.promptNumero("Informe o ID do cliente: ");

    const clienteOrError = await this.buscarClientePorIdUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (clienteOrError instanceof Error) {
      this.display(clienteOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display(
      `ID: ${String(clienteOrError.id)} | Nome: ${clienteOrError.nome} | E-mail: ${clienteOrError.email ?? "-"} | CPF: ${clienteOrError.cpf ?? "-"}`,
    );
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async atualizarCliente(): Promise<void> {
    const id = await this.promptNumero(
      "Informe o ID do cliente que deseja atualizar: ",
    );

    const dto = await this.promptInteractiveForm(
      "Informe os novos dados do cliente",
      CreateClienteDto.schema(),
      CreateClienteDto,
    );

    const clienteOrError = await this.atualizarClienteUc
      .execute(id, dto)
      .catch((error: unknown) => error as Error);

    if (clienteOrError instanceof Error) {
      this.display(clienteOrError.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("Cliente atualizado com sucesso!");
    await this.prompt("Pressione ENTER para continuar...");
  }

  private async removerCliente(): Promise<void> {
    const id = await this.promptNumero(
      "Informe o ID do cliente que deseja remover: ",
    );

    const resultado = await this.removerClienteUc
      .execute(id)
      .catch((error: unknown) => error as Error);

    if (resultado instanceof Error) {
      this.display(resultado.message);
      await this.prompt("Pressione ENTER para continuar...");
      return;
    }

    this.display("Cliente removido com sucesso!");
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
