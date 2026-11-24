# Checkpoint — Acessibilidade Web para Caloiros

Loja fictícia para a aula no ISEC. Astro, TypeScript e JavaScript do browser. API REST real em JSON Server, com persistência em `data/db.json`. Não existem pagamentos, contas ou serviços comerciais.

## Arrancar

Node.js 22.12 ou posterior. Na primeira utilização:

```sh
npm ci
npm run reset
npm run dev
```

Loja: http://127.0.0.1:4321 · API: http://127.0.0.1:3001/games

O comando `dev` inicia os dois processos. Ctrl+C termina ambos. A API está limitada ao computador local. Não alojar publicamente este JSON Server, que não inclui autenticação.

## Versões preparadas

| Endereço | Alterações face à inicial |
| --- | --- |
| `/` | Três barreiras deliberadas |
| `/filtro` | Filtro nativo com rótulo e suporte de teclado |
| `/contraste` | Contraste do preço corrigido |
| `/carrinho` | Região existente com `role="status"` |
| `/corrigida` | As três correções |

As correções isoladas mantêm as outras duas barreiras. O carrinho é partilhado entre as versões e guardado no servidor, não no localStorage. `npm run reset` restaura apenas os dados da demonstração e esvazia o carrinho; recarregar depois o browser. Não guardar dados pessoais neste ficheiro.

## Percurso da demonstração

1. Na inicial, escolher PC com rato e adicionar um jogo.
2. Repetir com teclado: o filtro não recebe foco. Inspecionar a `div role="button"` em `src/components/PlatformFilter.astro`.
3. Pedir ao agente uma correção localizada que prefira HTML nativo. Não ler as correções preparadas se quiseres demonstrar a investigação do agente.
4. Se necessário, abrir `/filtro` como recuperação. Tab chega ao select; escolher PC reduz seis ofertas a quatro.
5. Comparar `/` e `/contraste`. O preço muda de #aaa (baixo contraste) para #101010; o fundo é #f4f4f2.
6. Comparar `/` e `/carrinho` com VoiceOver: a mensagem visível permanece no mesmo local; a correção acrescenta semântica de região de estado. Confirmar o anúncio no Mac real.
7. Abrir `/corrigida`, repetir a tarefa e avaliar novamente. Três correções não demonstram conformidade WCAG do produto inteiro.

O carrinho modal usa `dialog.showModal()`. Permite exemplificar o APG: foco, Tab/Shift+Tab, Escape e retorno ao controlo de origem. Não faz parte das barreiras deliberadas.

## Verificação

```sh
npm run check
npm run build
```

Para pré-visualizar a build, manter `npm run api` num terminal e executar `npm run preview` noutro. O proxy `/api` funciona no desenvolvimento e no preview local; um alojamento estático exigiria configuração própria da API.

Verificado no browser em 24 de novembro de 2026: filtro com rato (seis para quatro ofertas PC), Tab a saltar o filtro inicial, seleção PC com teclado na versão corrigida, adição e persistência após recarregar, foco preservado após adicionar, abertura do diálogo e fecho com Escape com retorno ao botão de origem. A versão corrigida reorganiza os controlos numa coluna a 320 píxeis de largura.

`npm run check` terminou sem erros, avisos ou sugestões; `npm run build` gerou as cinco rotas. Ainda falta o ensaio com VoiceOver, a extensão escolhida e o projetor da sala. Não foi verificado o anúncio sonoro da região de estado.

## Base e imagens

Direção visual, paleta editorial e fonte Archivo adaptadas do [Atelier Kō](https://github.com/xocothemes/atelier-ko), de Andrei Alba, MIT, revisão `348433f5f0c58541077a0e584a8883a4d9488ba4`. A licença original está preservada. A licença da fonte está em `public/fonts/OFL-Archivo.txt`. Esta versão não inclui as restantes páginas, animações, checkout ou infraestrutura do tema.

Os preços são fictícios. Os jogos usados são uma seleção de lançamentos de 2025, não uma lista dos lançamentos mais recentes à data da aula. Capas promocionais pertencem aos respetivos titulares e foram obtidas das páginas oficiais na Steam. Não são abrangidas pela licença MIT do código:

- [Hades II — Supergiant Games](https://store.steampowered.com/app/1145350/Hades_II/)
- [Hollow Knight: Silksong — Team Cherry](https://store.steampowered.com/app/1030300/Hollow_Knight_Silksong/)
- [Clair Obscur: Expedition 33 — Sandfall Interactive / Kepler](https://store.steampowered.com/app/1903340/Clair_Obscur_Expedition_33/)
- [Split Fiction — Hazelight / Electronic Arts](https://store.steampowered.com/app/2001120/Split_Fiction/)

As plataformas das ofertas de demonstração foram verificadas na Steam, [Team Cherry](https://www.teamcherry.com.au/games) e [Expedition 33](https://www.expedition33.com/). As imagens são locais para a aula funcionar sem acesso aos servidores de imagens.
