# Gerenciador de Tarefas

Aplicação web para criar, acompanhar e organizar tarefas. O projeto foi desenvolvido com Next.js 15 e oferece uma interface responsiva, tema claro/escuro e operações de dados realizadas por meio do tRPC.

## Como o sistema funciona

A página principal exibe a lista de tarefas em uma tabela com carregamento infinito de 20 itens por vez. É possível:

- Criar uma tarefa com título e descrição;
- Editar ou excluir uma tarefa;
- Iniciar, pausar, retomar ou zerar o cronômetro de cada tarefa;
- Concluir uma tarefa após registrar tempo;
- Alternar entre tema claro e escuro;
- Receber mensagens de sucesso e erro por notificações.

A interface utiliza React Query para consultar e atualizar os dados. As operações são enviadas ao servidor por tRPC, em um endpoint interno da própria aplicação. As tarefas ficam armazenadas em memória no servidor; os dados são mantidos durante a execução em ambiente de desenvolvimento, mas são reiniciados quando o servidor reinicia ou em uma implantação sem estado persistente.

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- tRPC
- TanStack React Query
- Tailwind CSS
- shadcn/ui e Base UI
- Zod
- Sonner

## Pré-requisitos

- Node.js 20 ou superior
- npm

## Como executar

1. Acesse a pasta do projeto:

```bash
cd desafio-artefact-nextjs
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

As alterações feitas no código são atualizadas automaticamente pelo servidor de desenvolvimento.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Executa o projeto em modo de desenvolvimento |
| `npm run build` | Cria a versão de produção |
| `npm run start` | Inicia a versão de produção já compilada |
| `npm run lint` | Executa a análise estática do código |

Para verificar a versão de produção:

```bash
npm run build
npm run start
```
