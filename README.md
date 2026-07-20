# BookStore Manager CLI

Sistema de gerenciamento de livraria via terminal (CLI), desenvolvido em Node.js e TypeScript, com PostgreSQL como banco de dados. Projeto final avaliativo — Módulo 01.

## Descrição

O BookStore Manager CLI permite o gerenciamento completo de autores, livros, clientes e empréstimos de uma livraria, através de menus interativos no terminal. Todas as operações de cadastro, consulta, atualização e remoção são persistidas em um banco de dados PostgreSQL, com regras de negócio aplicadas antes de qualquer alteração.

## Objetivo

Consolidar os principais conhecimentos desenvolvidos ao longo do curso, aplicando Node.js, TypeScript, Programação Orientada a Objetos, programação assíncrona, arquitetura em camadas, modelagem de banco de dados relacional e boas práticas de versionamento com Git e GitHub.

## Tecnologias utilizadas

- **Node.js** — ambiente de execução
- **TypeScript** — linguagem, com tipagem estrita
- **PostgreSQL** — banco de dados relacional
- **pg** — driver de conexão com o PostgreSQL
- **Docker / Docker Compose** — orquestração do banco de dados
- **dotenv** — variáveis de ambiente
- **tsx** — execução de TypeScript em modo desenvolvimento
- **ESLint + Prettier** — padronização e qualidade de código
- **Git / GitHub** — controle de versão, seguindo o fluxo GitFlow

## Arquitetura do projeto

A aplicação segue uma arquitetura organizada em camadas, com separação clara de responsabilidades:

```
Usuário → View → UseCase → Repository → PostgreSQL
```

| Camada | Responsabilidade |
|---|---|
| **View** | Interação com o usuário via terminal: exibe menus, captura formulários, mostra mensagens |
| **UseCase** | Regras de negócio: validações, checagem de duplicidade, orquestração entre entidades |
| **Repository** | Única camada com acesso direto ao PostgreSQL, via SQL puro (biblioteca `pg`) |
| **Model** | Classes e interfaces que representam as entidades do sistema |
| **DTO** | Objetos de transferência de dados usados nos formulários de entrada |
| **@common** | Código compartilhado: conexão com o banco, motor de menus (`ConsoleView`), utilitários e tratamento de erros |

A injeção de dependência é feita manualmente via construtor: cada View recebe seus UseCases prontos, e cada UseCase recebe seus Repositories — nenhuma camada conhece os detalhes de implementação da camada seguinte.

## Estrutura de pastas

```
bookstore-manager-cli/
├── src/
│   ├── @common/
│   │   ├── database/       # Conexão com o PostgreSQL (Pool)
│   │   ├── errors/         # Exceções customizadas
│   │   ├── utils/          # Utilitários compartilhados (logger, readline)
│   │   └── view/           # Motor de menus do terminal (ConsoleView)
│   ├── model/
│   │   ├── autor/
│   │   ├── cliente/
│   │   ├── livro/
│   │   └── emprestimo/
│   ├── repositories/       # Acesso ao banco de dados (uma por entidade)
│   ├── usecase/
│   │   ├── autor-usecase/
│   │   ├── cliente-usecase/
│   │   ├── livro-usecase/
│   │   └── emprestimos-usecase/
│   ├── view/
│   │   ├── dto/             # DTOs de formulário de cada entidade
│   │   ├── autor.view.ts
│   │   ├── cliente.view.ts
│   │   ├── livro.view.ts
│   │   ├── emprestimo.view.ts
│   │   └── menu-principal.view.ts
│   └── main.ts               # Ponto de entrada da aplicação
├── schema.sql                 # Script de criação do banco de dados
├── docker-compose.yml         # Orquestração do PostgreSQL
├── .env.example                # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

## Modelo de dados

O banco possui 4 tabelas principais:

- **autores** — id, nome, nacionalidade
- **livros** — id, titulo, quantidade_disponivel, autor_id (FK → autores)
- **clientes** — id, nome, cpf (único), email (único), data_cadastro
- **emprestimos** — id, livro_id (FK → livros), cliente_id (FK → clientes), data_emprestimo, data_devolucao

Todo livro deve estar obrigatoriamente vinculado a um autor previamente cadastrado. O campo `data_devolucao` em empréstimos permanece `NULL` enquanto o empréstimo está em aberto, sendo preenchido apenas no momento da devolução.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

## Instalação

1. Clone o repositório:

```bash
git clone git@github.com:fe-l-i-p-e/bookstore-manager-CLI.git
cd bookstore-manager-cli
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` na raiz do projeto, com base no `.env.example`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bookstore
```

> Os valores devem coincidir com o que está definido no `docker-compose.yml`.

## Configuração do banco de dados

1. Suba o container do PostgreSQL:

```bash
docker compose up -d
```

2. Confirme que o container está rodando:

```bash
docker ps
```

3. Execute o script de criação das tabelas:

```bash
docker exec -i $(docker ps --filter "name=postgres" --format "{{.Names}}") psql -U postgres -d bookstore < schema.sql
```

4. (Opcional) Confirme que as tabelas foram criadas:

```bash
docker exec -it $(docker ps --filter "name=postgres" --format "{{.Names}}") psql -U postgres -d bookstore -c "\dt"
```

## Execução

Modo desenvolvimento (recomendado):

```bash
npm run dev
```

Build de produção:

```bash
npm run build
npm start
```

## Funcionalidades implementadas

### Autores
- Cadastrar, listar, buscar por ID, atualizar e remover autores
- Remoção bloqueada caso o autor tenha livros vinculados

### Livros
- Cadastrar, listar, buscar por ID, atualizar e remover livros
- Cadastro/atualização exigem um autor previamente cadastrado
- Remoção bloqueada caso o livro tenha empréstimos registrados

### Clientes
- Cadastrar, listar, buscar por ID, atualizar e remover clientes
- Validação de e-mail duplicado no cadastro

### Empréstimos
- Registrar empréstimo, com validação de existência de livro e cliente, e disponibilidade de estoque
- Registrar devolução, com atualização automática do estoque
- Impede devolução duplicada de um empréstimo já finalizado
- Listar empréstimos e consultar por ID

### Geral
- Tratamento de erros sem interrupção da aplicação
- Programação assíncrona com `async`/`await` e `try/catch`
- Consultas SQL diretas via `pg` (INSERT, UPDATE, DELETE, SELECT)

## Exemplos de uso

Ao iniciar a aplicação, o menu principal é exibido:

```
========================================
   Bem-vindo ao BookStore Manager CLI
   Sistema de Gestão de Livraria
========================================
1 - Autores
2 - Livros
3 - Clientes
4 - Empréstimos
0 - Sair
```

Cada opção leva a um submenu específico do módulo, com as operações de CRUD correspondentes.

## Integrantes da equipe

- Felipe Totti