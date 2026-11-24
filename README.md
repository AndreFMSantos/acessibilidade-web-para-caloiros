# Checkpoint — Acessibilidade Web para Caloiros

Loja fictícia para a aula no ISEC. Astro, TypeScript e JavaScript do browser, com API REST em JSON Server e persistência em `data/db.json`. Não existem pagamentos ou contas.

## Arrancar

Node.js 22.12 ou posterior. Na primeira utilização:

```sh
npm ci
npm run reset
npm run dev
```

Loja: http://127.0.0.1:4321 · API: http://127.0.0.1:3001/games

Ctrl+C termina ambos os processos. A API está limitada ao computador local e não inclui autenticação. Não a alojar publicamente nem guardar dados pessoais.

O catálogo está em `/` e as seis páginas de detalhes em `/jogos/<id>`. A pesquisa e os filtros são guardados no separador ao abrir um produto; o carrinho fica na API. `npm run reset` restaura os dados e esvazia o carrinho. Recarregar depois o browser.

As rotas são geradas a partir de `data/seed.json`. Ao acrescentar ofertas, atualizar o seed e gerar novamente a build. As View Transitions nativas respeitam a preferência de movimento reduzido; browsers sem suporte usam navegação normal.

## Verificar

```sh
npm run check
npm run build
```

Para testar a build, executar `npm run api` e, noutro terminal, `npm run preview`. O proxy da API funciona em desenvolvimento e no preview local. Um alojamento estático exige configuração própria da API.

## Testes de acessibilidade

```sh
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
```

O primeiro comando instala o Chromium usado pelos testes. `test:e2e` executa o axe em cada catálogo e página de detalhes; `test:e2e:ui` abre a interface interativa do Playwright. Os testes usam os dados do seed e uma API simulada, sem alterar o carrinho. O servidor de teste usa a porta 4322.

As violações detetadas fazem os testes falhar, incluindo o baixo contraste deliberado dos preços. Os resultados completos do axe ficam anexados aos testes. Estes testes automáticos não demonstram conformidade WCAG nem substituem a verificação de teclado e VoiceOver.

## Lint e formatação

```sh
npm run lint
npm run format
npm run format:check
npm run check:biome
```

Biome 2.6.9 está fixado no projeto e configurado para TypeScript, JavaScript, JSON, CSS e componentes Astro. O suporte completo a Astro é experimental e está ativado explicitamente; manter também `npm run check` e `npm run build`. Ver [suporte de linguagens do Biome](https://biomejs.dev/introduction/language-support/).

O lockfile, os dados mutáveis e os ficheiros gerados não são formatados. As supressões de acessibilidade são locais e documentadas: o filtro deliberadamente inacessível e o falso positivo no `aria-label` dinâmico do cartão. A regra CSS de especificidade descendente está desativada por sinalizar seletores de componentes que não se sobrepõem; os dois `!important` necessários têm justificação junto à declaração.

## Organização do código

- `src/components/`: HTML da loja em componentes Astro: `GameCard`, `GameCatalogue`, `Hero`, `SiteHeader`, `SiteFooter`, `CartDialog`, `CartFeedback`, `PlatformFilter`, `ProductDetail` e a composição `Store`.
- `src/layouts/SiteLayout.astro`: estrutura da página e carregamento do script.
- `src/scripts/api.ts`: pedidos e validação das respostas da API.
- `src/scripts/catalogue.ts` e `platform-filter.ts`: pesquisa, ordenação, visibilidade dos cartões e seleção de plataforma.
- `src/scripts/cart.ts`: estado do carrinho, adição, remoção e diálogo. As linhas clonam o template HTML definido em `CartDialog.astro`.
- `src/scripts/product.ts`: atualização dos detalhes com os dados da API.
- `src/scripts/store.ts`: apenas coordena a inicialização.
- `src/lib/`: tipos, formatação de preços e caminhos das páginas.

Os cartões são renderizados por Astro a partir do seed; o browser atualiza os seus dados a partir da API e mostra, oculta ou ordena os elementos existentes. Não constrói o HTML dos cartões em TypeScript. As ofertas do seed definem os cartões e as rotas disponíveis; acrescentar ofertas exige atualizar o seed e a build.

## Base e imagens

Direção visual, paleta editorial e fonte Archivo adaptadas do [Atelier Kō](https://github.com/xocothemes/atelier-ko), de Andrei Alba, MIT, revisão `348433f5f0c58541077a0e584a8883a4d9488ba4`. A licença original está preservada. A licença da fonte está em `public/fonts/OFL-Archivo.txt`. Esta versão não inclui as restantes páginas, animações, checkout ou infraestrutura do tema.

O catálogo inclui GTA VI, Fortnite, Minecraft e Call of Duty: Modern Warfare 4. Há seis ofertas de demonstração, distribuídas por plataforma. Fortnite é apresentado como Grátis; os preços dos outros jogos são fictícios. Modern Warfare 4 foi confirmado como o lançamento atual da série nas páginas oficiais em 24 de novembro de 2026. Imagens promocionais pertencem aos respetivos titulares e foram obtidas na Rockstar, Epic Games Store, Nintendo e Steam. Não são abrangidas pela licença MIT do código:

- [Grand Theft Auto VI — Rockstar Games](https://www.rockstargames.com/VI). Oferta fictícia para PS5; não representa uma versão PC. Fonte da imagem: `https://www.rockstargames.com/VI/_next/static/media/poster_full.0az_iud2g3y4j.jpg`.
- [Fortnite — Epic Games](https://store.epicgames.com/p/fortnite?lang=en-US)
- [Minecraft — Mojang / Microsoft](https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc). Imagem obtida na [Nintendo](https://www.nintendo.com/us/store/products/minecraft-switch/).
- [Call of Duty: Modern Warfare 4 — Activision](https://www.callofduty.com/modernwarfare4). Imagem obtida na [Steam](https://store.steampowered.com/app/4435490/Call_of_Duty_Modern_Warfare_4/).

As plataformas das ofertas de demonstração foram verificadas nas páginas oficiais acima, na [Rockstar](https://www.rockstargames.com/VI/out-now) e no [download de Fortnite](https://www.fortnite.com/download). As imagens são locais para a aula funcionar sem acesso aos servidores de imagens.
