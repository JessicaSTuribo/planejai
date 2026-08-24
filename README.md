# Planej.ai

Aplicação de simulação financeira: o usuário responde a um formulário curto sobre renda, custos fixos, dívidas e uma meta (nome, valor e prazo), e a aplicação calcula se a meta é alcançável, quanto precisa economizar por mês e apresenta um diagnóstico com recomendações.

## O que o projeto faz

- Coleta os dados financeiros do usuário em um formulário de múltiplos passos (`/`).
- Salva cada simulação no `localStorage` do navegador.
- Gera uma página de resultado (`/resultado/:id`) com:
  - cards mostrando a meta, o prazo em meses e a economia mensal disponível (renda − custos − dívidas);
  - um diagnóstico de IA (hoje calculado localmente, como stub) que indica se a meta é viável e traz recomendações.
- Permite alternar entre tema claro e escuro.

## Como executar a aplicação

Pré-requisitos: [Node.js](https://nodejs.org/) 20+ e [pnpm](https://pnpm.io/).

```bash
# instalar dependências
pnpm install

# subir o servidor de desenvolvimento
pnpm dev
```

Acesse a URL exibida no terminal (por padrão `http://localhost:5173`).

Outros scripts úteis:

```bash
pnpm build   # build de produção (roda o type-check antes)
pnpm preview # serve o build de produção localmente
pnpm lint    # ESLint
pnpm format  # Prettier
```

## Tecnologias usadas

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como bundler/dev server
- [React Router](https://reactrouter.com/) para as rotas (`/`, `/resultado/:id`, `/historico`)
- [Tailwind CSS v4](https://tailwindcss.com/) para estilização
- [Lucide React](https://lucide.dev/) para ícones
- ESLint + Prettier para padronização de código
- `localStorage` como camada de persistência (sem backend)

## Qual melhoria eu implementei

O projeto base tinha o formulário de simulação funcionando, mas a rota `/resultado` ainda não existia de fato — navegar para lá após submeter o formulário resultava em tela em branco, pois a rota não capturava o `:id` da simulação salva.

Implementei a página de resultados completa:

- Correção da rota em [src/router.tsx](src/router.tsx) para `/resultado/:id`.
- [src/pages/SimulationResultsPage.tsx](src/pages/SimulationResultsPage.tsx): busca a simulação pelo `id` da URL, trata o caso de simulação não encontrada e monta os cards de meta, prazo e economia mensal disponível.
- Componentes reutilizáveis novos: [src/components/shared/PageHero.tsx](src/components/shared/PageHero.tsx) e [src/components/features/SimulationResults/Card.tsx](src/components/features/SimulationResults/Card.tsx), seguindo o mesmo padrão visual já usado no restante do app (`bg-card`, `rounded-2xl`, sombra e tokens de cor do tema).
- Diagnóstico de IA plugado na página: [src/hooks/useInsight.ts](src/hooks/useInsight.ts) busca a simulação e chama o serviço de geração de insight, controlando estados de carregamento, erro e nova tentativa; [src/components/features/SimulationResults/AIInsightCard.tsx](src/components/features/SimulationResults/AIInsightCard.tsx) exibe esse resultado (com um botão de "tentar novamente" em caso de falha).
- Removido um `console.log` de depuração que havia ficado no fluxo do formulário.

## Como testar o fluxo principal

1. Rode `pnpm dev` e abra a aplicação no navegador.
2. Na página inicial, responda as 6 perguntas do formulário (renda, custos fixos, dívidas, nome da meta, valor da meta e prazo em meses), avançando com "Próximo".
3. No último passo, clique em "Gerar simulação".
4. Você será redirecionado para `/resultado/<id-da-simulação>`, onde deve ver:
   - o card da meta (nome e valor);
   - o card de prazo (em meses);
   - o card de economia mensal disponível;
   - o card de diagnóstico de IA, que primeiro mostra "Gerando diagnóstico..." e em seguida exibe o resumo e as recomendações.
5. Para testar o caso de erro/retentativa do diagnóstico, ou o caso de simulação inexistente, acesse manualmente uma URL como `/resultado/id-que-nao-existe` — a página deve exibir "Simulação não encontrada." em vez de quebrar.

## O que eu aprendi durante o desafio

- A importância de olhar o fluxo de ponta a ponta antes de assumir que uma feature está pronta: a rota `/resultado` "existia", mas sem o parâmetro `:id` o app quebrava silenciosamente — um erro que só aparece navegando de verdade pela aplicação, não apenas lendo o código.
- Reforcei o cuidado de seguir os tokens de design já estabelecidos no projeto (`bg-card`, `text-muted-foreground`, a mesma sombra usada nos cards existentes) em vez de introduzir estilos novos, para manter a interface visualmente coesa mesmo com componentes criados por mim.
- Lidar com uma regra de lint mais recente do `eslint-plugin-react-hooks` (`set-state-in-effect`), que sinaliza `setState` síncrono dentro de `useEffect` — mesmo em busca de dados assíncrona. Isso me fez repensar o hook de diagnóstico (`useInsight`) para só atualizar estado depois de um ponto assíncrono real, evitando o anti-padrão de derivar estado diretamente no corpo do efeito.
- Validar a interface manualmente com testes automatizados de navegador (Playwright), simulando o preenchimento do formulário e conferindo o resultado renderizado, foi mais confiável do que apenas confiar no type-check e no lint para garantir que a funcionalidade realmente funciona para o usuário.
