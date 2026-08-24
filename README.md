# Planej.ai

Aplicação de simulação financeira: o usuário responde a um formulário curto sobre renda, custos fixos, dívidas e uma meta (nome, valor e prazo), e a aplicação calcula se a meta é alcançável, quanto precisa economizar por mês e apresenta um diagnóstico com recomendações.

## O que o projeto faz

- Coleta os dados financeiros do usuário em um formulário de múltiplos passos (`/`).
- Salva cada simulação no `localStorage` do navegador.
- Gera uma página de resultado (`/resultado/:id`) com:
  - cards mostrando a meta, o prazo em meses e a economia mensal disponível (renda − custos − dívidas);
  - um diagnóstico gerado por IA (Google Gemini) com viabilidade da meta, diagnóstico do orçamento, sugestões, ideias de renda extra, sugestões de investimento e uma mensagem motivacional.
- Permite alternar entre tema claro e escuro.

## Como executar a aplicação

Pré-requisitos: [Node.js](https://nodejs.org/) 20+, [pnpm](https://pnpm.io/) e uma chave de API do [Google AI Studio](https://aistudio.google.com/apikey) (Gemini).

```bash
# instalar dependências
pnpm install

# copiar o arquivo de exemplo e colar sua chave da Gemini
cp .env.example .env

# subir o servidor de desenvolvimento
pnpm dev
```

Acesse a URL exibida no terminal (por padrão `http://localhost:5173`).

> ⚠️ **Sobre a chave de API**: este é um app 100% front-end, sem backend. A chave definida em `VITE_GEMINI_API_KEY` fica embutida no JavaScript enviado ao navegador em `pnpm build` — qualquer pessoa que inspecionar o site publicado consegue lê-la. Isso é aceitável para rodar localmente ou fazer um demo com uma chave gratuita/descartável, mas **não é seguro para produção**; o correto seria mover essa chamada para um backend/serverless que guarde a chave no servidor.

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
- [Google Gemini API](https://ai.google.dev/) para o diagnóstico financeiro por IA
- ESLint + Prettier para padronização de código
- `localStorage` como camada de persistência (sem backend)

## Qual melhoria eu implementei

O projeto base tinha o formulário de simulação funcionando, mas a rota `/resultado` ainda não existia de fato — navegar para lá após submeter o formulário resultava em tela em branco, pois a rota não capturava o `:id` da simulação salva.

Implementei a página de resultados completa:

- Correção da rota em [src/router.tsx](src/router.tsx) para `/resultado/:id`.
- [src/pages/SimulationResultsPage.tsx](src/pages/SimulationResultsPage.tsx): busca a simulação pelo `id` da URL, trata o caso de simulação não encontrada e monta os cards de meta, prazo e economia mensal disponível.
- Componentes reutilizáveis novos: [src/components/shared/PageHero.tsx](src/components/shared/PageHero.tsx) e [src/components/features/SimulationResults/Card.tsx](src/components/features/SimulationResults/Card.tsx), seguindo o mesmo padrão visual já usado no restante do app (`bg-card`, `rounded-2xl`, sombra e tokens de cor do tema).
- Diagnóstico de IA plugado na página: [src/hooks/useInsight.ts](src/hooks/useInsight.ts) busca a simulação e chama o serviço de geração de insight, controlando estados de carregamento, erro e nova tentativa; [src/components/features/SimulationResults/AIInsightCard.tsx](src/components/features/SimulationResults/AIInsightCard.tsx) exibe esse resultado (com um botão de "tentar novamente" em caso de falha).
- Integração real com a **Gemini API**: [src/services/aiService.ts](src/services/aiService.ts) monta o prompt com [src/components/data/aiPrompt.ts](src/components/data/aiPrompt.ts), chama o modelo `gemini-3.6-flash` pedindo resposta em JSON estruturado (viabilidade, diagnóstico, sugestões, renda extra, investimentos e mensagem motivacional) e o `AIInsightCard` renderiza cada seção.
- Removido um `console.log` de depuração que havia ficado no fluxo do formulário.

## Como testar o fluxo principal

1. Crie o `.env` com sua chave da Gemini (veja a seção "Como executar") e rode `pnpm dev`.
2. Na página inicial, responda as 6 perguntas do formulário (renda, custos fixos, dívidas, nome da meta, valor da meta e prazo em meses), avançando com "Próximo".
3. No último passo, clique em "Gerar simulação".
4. Você será redirecionado para `/resultado/<id-da-simulação>`, onde deve ver:
   - o card da meta (nome e valor);
   - o card de prazo (em meses);
   - o card de economia mensal disponível;
   - o card "Diagnóstico com IA", que primeiro mostra "Gerando diagnóstico..." e em seguida chama a Gemini de verdade e exibe viabilidade, diagnóstico, sugestões, renda extra, investimentos e mensagem motivacional.
5. Se a chamada à Gemini falhar (chave inválida, sem créditos, etc.), o card mostra uma mensagem de erro com um botão "Tentar novamente" em vez de quebrar a página.
6. Para testar o caso de simulação inexistente, acesse manualmente uma URL como `/resultado/id-que-nao-existe` — a página deve exibir "Simulação não encontrada.".
7. Clicar no logo "Planej.ai" no cabeçalho, em qualquer página, deve voltar para `/`.

## O que eu aprendi durante o desafio

- A importância de olhar o fluxo de ponta a ponta antes de assumir que uma feature está pronta: a rota `/resultado` "existia", mas sem o parâmetro `:id` o app quebrava silenciosamente — um erro que só aparece navegando de verdade pela aplicação, não apenas lendo o código.
- Reforcei o cuidado de seguir os tokens de design já estabelecidos no projeto (`bg-card`, `text-muted-foreground`, a mesma sombra usada nos cards existentes) em vez de introduzir estilos novos, para manter a interface visualmente coesa mesmo com componentes criados por mim.
- Lidar com uma regra de lint mais recente do `eslint-plugin-react-hooks` (`set-state-in-effect`), que sinaliza `setState` síncrono dentro de `useEffect` — mesmo em busca de dados assíncrona. Isso me fez repensar o hook de diagnóstico (`useInsight`) para só atualizar estado depois de um ponto assíncrono real, evitando o anti-padrão de derivar estado diretamente no corpo do efeito.
- Validar a interface manualmente com testes automatizados de navegador (Playwright), simulando o preenchimento do formulário e conferindo o resultado renderizado, foi mais confiável do que apenas confiar no type-check e no lint para garantir que a funcionalidade realmente funciona para o usuário.
- Ao integrar a Gemini de verdade, reforcei o cuidado com segredos: um app 100% front-end não tem como esconder uma API key do usuário final (ela vai parar no bundle JS publicado), então documentei isso claramente no README e mantive a chave fora do Git via `.env` + `.gitignore`, com um `.env.example` para orientar quem for rodar o projeto. Para produção de verdade, essa chamada precisaria passar por um backend.
- Testei a integração interceptando a chamada de rede com Playwright (`page.route`) para simular tanto o sucesso quanto a falha da API, sem depender de créditos reais — útil porque a chave usada no desenvolvimento ficou sem saldo durante os testes.
