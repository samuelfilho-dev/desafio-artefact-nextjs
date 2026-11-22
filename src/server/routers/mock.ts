import { Task } from "../model";

const taskTitles = [
  "Implementar autenticação",
  "Corrigir validação do formulário",
  "Criar endpoint de usuários",
  "Implementar paginação",
  "Refatorar serviço de tarefas",
  "Adicionar testes unitários",
  "Configurar banco de dados",
  "Implementar cache Redis",
  "Criar componente de dashboard",
  "Melhorar responsividade",
  "Implementar notificações",
  "Corrigir bug de carregamento",
  "Adicionar documentação",
  "Configurar pipeline CI/CD",
  "Implementar controle de acesso",
  "Criar middleware de segurança",
  "Otimizar consultas SQL",
  "Implementar upload de arquivos",
  "Criar sistema de relatórios",
  "Atualizar dependências",
  "Implementar filtros avançados",
  "Criar tela de configurações",
  "Adicionar logs de auditoria",
  "Implementar recuperação de senha",
  "Melhorar performance da API",
  "Criar testes de integração",
  "Implementar busca de usuários",
  "Corrigir problemas de layout",
  "Criar serviço de pagamentos",
  "Implementar exportação CSV",
];

const descriptions = [
  "Desenvolver a funcionalidade seguindo os padrões arquiteturais do projeto.",
  "Analisar o comportamento atual e corrigir os problemas identificados.",
  "Implementar a solução com validações e tratamento adequado de erros.",
  "Criar uma implementação reutilizável e de fácil manutenção.",
  "Adicionar testes para garantir o funcionamento esperado.",
  "Revisar o código e melhorar a organização dos componentes.",
  "Integrar a funcionalidade com os serviços existentes.",
  "Garantir compatibilidade com os requisitos do sistema.",
  "Melhorar a experiência do usuário e a usabilidade da aplicação.",
  "Documentar as alterações realizadas para facilitar futuras manutenções.",
];

/**
 * Creates a mock list of tasks for testing and development purposes.
 * Each task has a unique ID, title, description, completion status, time spent, and creation date.
 * The list contains 150 tasks with randomized properties.
 * @returns {Task[]} An array of mock Task objects.
 */
export const mockTasks: Task[] = Array.from(
  { length: 150 },
  (_, index): Task => ({
    id: crypto.randomUUID(),
    title: `${taskTitles[index % taskTitles.length]}${index >= taskTitles.length ? ` #${Math.floor(index / taskTitles.length) + 1}` : ""}`,
    description: descriptions[index % descriptions.length],
    isCompleted: index % 4 !== 0,
    timeSpentMs: Math.floor(Math.random() * 7200000),
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    ),
  }),
);
