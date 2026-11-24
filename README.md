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

Para a correção com um coding agent, usar as branches:

- `demo/inicial`: loja com as três barreiras, sem rotas ou implementações corrigidas no código de trabalho.
- `demo/resolvida`: a mesma loja, com filtro nativo, preço com contraste corrigido e confirmação do carrinho com `role="status"`.
- `main`: mantém as rotas de comparação abaixo e a documentação da aula.

Antes da aula, parar os servidores, mudar para `demo/inicial` e criar uma branch para o ensaio:

```sh
git switch demo/inicial
git switch -c demo/ensaio
npm run reset
npm run dev
```

O agente deve trabalhar nessa branch sem consultar as soluções. As soluções continuam acessíveis no histórico Git e nas outras branches: esta separação não é uma barreira de acesso. Para comparar só as três correções: `git diff demo/inicial..demo/resolvida -- src`. Para recuperação, parar os servidores e abrir a branch resolvida num checkout limpo; preservar primeiro quaisquer alterações do ensaio.

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
4. Se necessário, abrir `/filtro` como recuperação. Tab chega ao select; escolher PC reduz seis ofertas a três.
5. Comparar `/` e `/contraste`. O preço muda de #aaa (baixo contraste) para #101010; o fundo é #f4f4f2.
6. Comparar `/` e `/carrinho` com VoiceOver: a mensagem visível permanece no mesmo local; a correção acrescenta semântica de região de estado. Confirmar o anúncio no Mac real.
7. Abrir `/corrigida`, repetir a tarefa e avaliar novamente. Três correções não demonstram conformidade WCAG do produto inteiro.

O carrinho modal usa `dialog.showModal()`. Permite exemplificar o APG: foco, Tab/Shift+Tab, Escape e retorno ao controlo de origem. Não faz parte das barreiras deliberadas.

## Páginas de detalhes

As capas e os títulos do catálogo abrem uma página por oferta, por exemplo `/jogos/minecraft-pc`. Cada versão tem as suas páginas, como `/corrigida/jogos/minecraft-pc`, preservando as correções dessa versão. Os detalhes incluem descrição, plataforma, edição, preço, ligação às outras plataformas e adição ao mesmo carrinho da API.

Ao abrir um produto, a pesquisa, ordenação e plataforma ficam guardadas no `sessionStorage` do separador, por versão. O catálogo recupera esse estado no regresso. O carrinho continua guardado exclusivamente na API.

Usamos [View Transitions nativas entre documentos](https://docs.astro.build/en/guides/view-transitions/), com ligações HTML normais e sem `ClientRouter`. A animação dura 180 ms e é desativada com `prefers-reduced-motion: reduce`. Browsers sem suporte mantêm a navegação normal. As capas têm nomes de transição por oferta; o efeito de continuidade depende de a imagem estar renderizada no destino.

As rotas e ligações entre plataformas são geradas a partir de `data/seed.json`. Os dados visíveis e o carrinho são carregados da API. Acrescentar ofertas ou alterar as plataformas exige atualizar o seed e voltar a gerar a build.

## Verificação

```sh
npm run check
npm run build
```

Para pré-visualizar a build, manter `npm run api` num terminal e executar `npm run preview` noutro. O proxy `/api` funciona no desenvolvimento e no preview local; um alojamento estático exigiria configuração própria da API.

Verificado no browser em 24 de novembro de 2026: filtro inicial com rato e filtro corrigido com teclado (seis ofertas, três para PC), Tab a saltar o filtro inicial, seleção PC com teclado na versão corrigida, adição e persistência após recarregar, foco preservado após adicionar, abertura do diálogo e fecho com Escape com retorno ao botão de origem. A versão corrigida reorganiza os controlos numa coluna a 320 píxeis de largura.

Também foram verificados: abertura dos detalhes por teclado, adição de Minecraft para PC, combinação correta no carrinho, regresso pelo histórico com filtro PC e carrinho preservados, e mudança para a oferta Nintendo Switch sem sair da versão corrigida.

`npm run check` terminou sem erros, avisos ou sugestões; `npm run build` gerou 35 rotas: cinco catálogos e 30 páginas de detalhes. Ainda falta o ensaio com VoiceOver, a extensão escolhida e o projetor da sala. Não foi verificado o anúncio sonoro da região de estado nem o efeito animado em todos os browsers.

## Base e imagens

Direção visual, paleta editorial e fonte Archivo adaptadas do [Atelier Kō](https://github.com/xocothemes/atelier-ko), de Andrei Alba, MIT, revisão `348433f5f0c58541077a0e584a8883a4d9488ba4`. A licença original está preservada. A licença da fonte está em `public/fonts/OFL-Archivo.txt`. Esta versão não inclui as restantes páginas, animações, checkout ou infraestrutura do tema.

O catálogo inclui GTA VI, Fortnite, Minecraft e Call of Duty: Modern Warfare 4. Há seis ofertas de demonstração, distribuídas por plataforma. Fortnite é apresentado como Grátis; os preços dos outros jogos são fictícios. Modern Warfare 4 foi confirmado como o lançamento atual da série nas páginas oficiais em 24 de novembro de 2026. Imagens promocionais pertencem aos respetivos titulares e foram obtidas na Rockstar, Epic Games Store, Nintendo e Steam. Não são abrangidas pela licença MIT do código:

- [Grand Theft Auto VI — Rockstar Games](https://www.rockstargames.com/VI). Oferta fictícia para PS5; não representa uma versão PC. Fonte da imagem: `https://www.rockstargames.com/VI/_next/static/media/poster_full.0az_iud2g3y4j.jpg`.
- [Fortnite — Epic Games](https://store.epicgames.com/p/fortnite?lang=en-US)
- [Minecraft — Mojang / Microsoft](https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc). Imagem obtida na [Nintendo](https://www.nintendo.com/us/store/products/minecraft-switch/).
- [Call of Duty: Modern Warfare 4 — Activision](https://www.callofduty.com/modernwarfare4). Imagem obtida na [Steam](https://store.steampowered.com/app/4435490/Call_of_Duty_Modern_Warfare_4/).

As plataformas das ofertas de demonstração foram verificadas nas páginas oficiais acima, na [Rockstar](https://www.rockstargames.com/VI/out-now) e no [download de Fortnite](https://www.fortnite.com/download). As imagens são locais para a aula funcionar sem acesso aos servidores de imagens.
