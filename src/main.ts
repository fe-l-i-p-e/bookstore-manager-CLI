import "dotenv/config";
import { initDatabase, pool } from "./@common/database/database";
import { AutorRepository } from "./repositories/autor.repository";
import { ClienteRepository } from "./repositories/client.repository";
import { EmprestimoRepository } from "./repositories/emprestimo.repository";
import { LivroRepository } from "./repositories/livro.repository";
import { AtualizarAutorUseCase } from "./usecase/autor-usecase/atualizar-autor.uc";
import { BuscarAutorPorIdUseCase } from "./usecase/autor-usecase/buscar-autor-por-id.uc";
import { CriarAutorUseCase } from "./usecase/autor-usecase/criar-autor.uc";
import { ListarAutoresUseCase } from "./usecase/autor-usecase/listar-autores.uc";
import { RemoverAutorUseCase } from "./usecase/autor-usecase/remover-autor.uc";
import { AtualizarClienteUseCase } from "./usecase/cliente-usecase/atualizar-cliente.uc";
import { BuscarClientePorIdUseCase } from "./usecase/cliente-usecase/buscar-cliente-por-id.uc";
import { CriarClienteUseCase } from "./usecase/cliente-usecase/criar-cliente.uc";
import { ListarClientesUseCase } from "./usecase/cliente-usecase/listar-clientes.uc";
import { RemoverClienteUseCase } from "./usecase/cliente-usecase/remover-cliente.uc";
import { BuscarEmprestimoPorIdUseCase } from "./usecase/emprestimos-usecase/buscar-emprestimo.uc";
import { CriarEmprestimoUseCase } from "./usecase/emprestimos-usecase/criar-emprestimo.uc";
import { ListarEmprestimosUseCase } from "./usecase/emprestimos-usecase/listar-emprestimos.uc";
import { RegistrarDevolucaoUseCase } from "./usecase/emprestimos-usecase/registrar-devolucao-emprestimo.uc";
import { AtualizarLivroUseCase } from "./usecase/livro-usecase/atualizar-livro.uc";
import { BuscarLivroPorIdUseCase } from "./usecase/livro-usecase/buscar-livro-por-id.uc";
import { CriarLivroUseCase } from "./usecase/livro-usecase/criar-livro.uc";
import { ListarLivrosUseCase } from "./usecase/livro-usecase/listar-livros.uc";
import { RemoverLivroUseCase } from "./usecase/livro-usecase/remover-livro.uc";
import { AutorView } from "./view/autor.view";
import { ClienteView } from "./view/cliente.view";
import { EmprestimoView } from "./view/emprestimo.view";
import { LivroView } from "./view/livro.view";
import { MenuPrincipalView } from "./view/menu-principal.view";

async function bootstrap(): Promise<void> {
  await initDatabase();

  const autorRepository = new AutorRepository(pool);
  const livroRepository = new LivroRepository(pool);
  const clienteRepository = new ClienteRepository(pool);
  const emprestimoRepository = new EmprestimoRepository(pool);

  const criarAutorUc = new CriarAutorUseCase(autorRepository);
  const listarAutoresUc = new ListarAutoresUseCase(autorRepository);
  const buscarAutorPorIdUc = new BuscarAutorPorIdUseCase(autorRepository);
  const atualizarAutorUc = new AtualizarAutorUseCase(autorRepository);
  const removerAutorUc = new RemoverAutorUseCase(autorRepository);

  const criarLivroUc = new CriarLivroUseCase(livroRepository, autorRepository);
  const listarLivrosUc = new ListarLivrosUseCase(livroRepository);
  const buscarLivroPorIdUc = new BuscarLivroPorIdUseCase(livroRepository);
  const atualizarLivroUc = new AtualizarLivroUseCase(
    livroRepository,
    autorRepository,
  );
  const removerLivroUc = new RemoverLivroUseCase(livroRepository);

  const criarClienteUc = new CriarClienteUseCase(clienteRepository);
  const listarClientesUc = new ListarClientesUseCase(clienteRepository);
  const buscarClientePorIdUc = new BuscarClientePorIdUseCase(clienteRepository);
  const atualizarClienteUc = new AtualizarClienteUseCase(clienteRepository);
  const removerClienteUc = new RemoverClienteUseCase(clienteRepository);

  const criarEmprestimoUc = new CriarEmprestimoUseCase(
    emprestimoRepository,
    livroRepository,
    clienteRepository,
  );
  const listarEmprestimosUc = new ListarEmprestimosUseCase(
    emprestimoRepository,
  );
  const buscarEmprestimoPorIdUc = new BuscarEmprestimoPorIdUseCase(
    emprestimoRepository,
  );
  const registrarDevolucaoUc = new RegistrarDevolucaoUseCase(
    emprestimoRepository,
    livroRepository,
  );

  const autorView = new AutorView(
    criarAutorUc,
    listarAutoresUc,
    buscarAutorPorIdUc,
    atualizarAutorUc,
    removerAutorUc,
  );

  const livroView = new LivroView(
    criarLivroUc,
    listarLivrosUc,
    buscarLivroPorIdUc,
    atualizarLivroUc,
    removerLivroUc,
    listarAutoresUc,
  );

  const clienteView = new ClienteView(
    criarClienteUc,
    listarClientesUc,
    buscarClientePorIdUc,
    atualizarClienteUc,
    removerClienteUc,
  );

  const emprestimoView = new EmprestimoView(
    criarEmprestimoUc,
    listarEmprestimosUc,
    buscarEmprestimoPorIdUc,
    registrarDevolucaoUc,
    listarLivrosUc,
    listarClientesUc,
  );

  const menuPrincipalView = new MenuPrincipalView(
    autorView,
    livroView,
    clienteView,
    emprestimoView,
  );

  await menuPrincipalView.start();
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
