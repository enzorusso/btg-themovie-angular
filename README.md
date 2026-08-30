# 🎬 Catálogo de Filmes

Aplicação front-end desenvolvida em Angular que consome a API pública do [TheMovieDB (TMDB)](https://www.themoviedb.org/documentation/api) para exibir filmes populares, lançamentos e permitir busca e visualização de detalhes.

---

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um teste técnico, com o objetivo de demonstrar boas práticas de desenvolvimento front-end com Angular, organização de código, componentização e consumo de API externa.

### Funcionalidades

- ✅ **Listagem de Filmes por Seção** — Populares, Melhores Avaliados e seções por categoria (Ação, Comédia), cada uma num carrossel horizontal com loop infinito e a posição de scroll lembrada ao voltar pra tela.
- ✅ **Filmes a serem Lançados** — banner na tela inicial com os próximos lançamentos, autoplay que pausa ao passar o mouse.
- ✅ **Busca de Filmes** — um único campo de busca que retorna, ao mesmo tempo, filmes por título, ator e diretor, com listagem e paginação dos resultados.
- ✅ **Detalhes do Filme** — título, sinopse, gêneros, data de lançamento, avaliação média, elenco e pôster em alta resolução.
- ✅ **Navegação** — Angular Router entre listagem, busca e detalhes; sem botões "voltar" na UI (clicar no logo "Catálogo" leva pra home), com a posição de scroll da página restaurada ao usar os controles do próprio navegador (mesmo com conteúdo assíncrono).
- ✅ **Tema escuro** — fundo `#2e3349` fixo, com feedback visual (borda branca) ao passar o mouse sobre pôsteres e o banner.
- ✅ **Componentização** — responsabilidades separadas em componentes reutilizáveis (card de filme, carrossel, busca, paginação, skeleton, etc).

### Diferenciais implementados

- [x] Paginação na listagem de filmes
- [x] Testes unitários
- [ ] Deploy (Vercel / Netlify / GitHub Pages)
- [x] State Management (Signals)
- [x] Lazy Loading e modularização
- [x] Interface responsiva
- [ ] Localização (Inglês e Português)
- [x] Filmes por categoria — não como filtro de busca (removido de lá em favor da busca combinada; ver [Decisões Técnicas](#-decisões-técnicas)), mas como seções da home (Ação, Comédia) via `/discover/movie?with_genres=`

---

## 🚀 Tecnologias Utilizadas

- [Angular](https://angular.dev/) 22
- TypeScript
- HTML5 / SCSS
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Angular Material](https://material.angular.dev/) + CDK
- [TheMovieDB API](https://developer.themoviedb.org/reference/intro/getting-started)

### Bibliotecas externas

| Biblioteca                                        | Por que foi usada                                                                                 | Benefícios trazidos                                                                          |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Angular Material](https://material.angular.dev/) + CDK | Componentes de UI prontos e acessíveis (inputs, botões, ícones, form-fields), já integrados ao theming Material 3 do Angular | Agilidade no desenvolvimento sem reinventar componentes básicos, com acessibilidade e consistência visual de fábrica |
| [Tailwind CSS](https://tailwindcss.com/)             | Utilitários de layout, espaçamento e responsividade direto no template, sem escrever SCSS repetitivo | Iteração rápida de UI (grids responsivos na home e na busca, carrosséis, skeletons) com pouco código |

---

## 🔧 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [Angular CLI](https://angular.dev/tools/cli) (versão 22+)

```bash
npm install -g @angular/cli
```

Você também precisa de uma **API Key gratuita** do TheMovieDB:

1. Crie uma conta em [themoviedb.org](https://www.themoviedb.org/)
2. Acesse as configurações da conta > API
3. Solicite uma chave de API (v3 auth) ou um Access Token (v4 auth)

---

## ⚙️ Instalação e Configuração

1. Clone o repositório:

```bash
git clone https://github.com/enzorusso/btg-themovie-angular.git
cd btg-themovie-angular
```

2. Instale as dependências:

```bash
npm install
```

3. Configure sua chave da API do TMDB.

   Edite os arquivos de ambiente em `src/environments/`:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  tmdbApiKey: 'SUA_API_KEY_AQUI',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/',
};
```

A chave é injetada automaticamente em toda chamada à TMDB por um `HttpInterceptor` (`tmdb-api-key-interceptor.ts`) — nenhum serviço ou componente precisa lidar com autenticação manualmente.

---

## ▶️ Rodando o projeto localmente

```bash
ng serve
```

Acesse [http://localhost:4200](http://localhost:4200) no navegador. A aplicação recarrega automaticamente ao salvar alterações nos arquivos.

---

## 🧪 Rodando os testes

```bash
ng test
```

Executa os testes unitários através do [Vitest](https://vitest.dev), usando o builder `@angular/build:unit-test`.

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                        # Serviços singleton, interceptors e models — sem UI
│   │   ├── interceptors/
│   │   │   └── tmdb-api-key-interceptor.ts   # injeta a api_key em toda chamada à TMDB
│   │   ├── models/                  # Movie, MovieDetails, CastMember, Person, etc.
│   │   └── services/
│   │       ├── tmdb.ts                      # único ponto de acesso à API da TMDB
│   │       └── carousel-scroll-memory.ts    # lembra o scroll horizontal de cada carrossel entre navegações
│   │
│   ├── features/                    # uma pasta por tela/fluxo, lazy-loaded via app.routes.ts
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── banner-carousel/   # banner de lançamentos, autoplay que pausa no hover
│   │   │   │   └── movies-carousel/   # carrossel genérico com loop infinito, usado por várias seções
│   │   │   ├── pages/home/
│   │   │   ├── home-module.ts
│   │   │   └── home-routing-module.ts
│   │   │
│   │   ├── movie-details/
│   │   │   ├── components/cast-list/
│   │   │   ├── pages/movie-details/
│   │   │   ├── movie-details-module.ts
│   │   │   └── movie-details-routing-module.ts
│   │   │
│   │   └── search/
│   │       ├── pages/search/
│   │       ├── search-module.ts
│   │       └── search-routing-module.ts
│   │
│   ├── shared/                      # componentes/pipes/utils reutilizados por mais de uma feature
│   │   ├── components/
│   │   │   ├── movie-card/          # card de filme (poster + título + nota)
│   │   │   ├── pagination/          # "‹ Página X de Y ›", usado na busca
│   │   │   ├── search-bar/          # busca fixa no topo (app.html), fora do router-outlet
│   │   │   └── skeleton/            # bloco de loading padronizado em todas as telas
│   │   ├── material/                # módulo agregando os componentes do Angular Material usados
│   │   ├── pipes/
│   │   │   └── tmdb-image-pipe.ts   # monta a URL de imagem a partir do path da TMDB
│   │   ├── utils/
│   │   │   └── scroll-restoration.ts  # restaura o scroll da página só depois que o conteúdo assíncrono carrega
│   │   └── shared-module.ts
│   │
│   ├── app.html
│   ├── app.ts                       # componente raiz (standalone), hospeda a search-bar
│   └── app.routes.ts
│
├── environments/
└── styles.scss
```

Cada feature segue o mesmo padrão: um `*-module.ts` (declarations) + `*-routing-module.ts` (rota própria), carregado sob demanda via `loadChildren` em `app.routes.ts`.

---

## 🌐 Endpoints da API utilizados

| Funcionalidade                              | Endpoint TMDB                                        |
| -------------------------------------------- | -------------------------------------------------------- |
| Filmes populares                             | `GET /movie/popular`                                  |
| Filmes a serem lançados                      | `GET /movie/upcoming`                                 |
| Melhores avaliados                           | `GET /movie/top_rated`                                |
| Filmes por categoria (seções da home)        | `GET /discover/movie?with_genres={genre_id}`          |
| Detalhes do filme                            | `GET /movie/{movie_id}`                               |
| Elenco e equipe técnica                      | `GET /movie/{movie_id}/credits`                       |
| Busca por título                             | `GET /search/movie`                                   |
| Busca por pessoa (resolve nome → id)         | `GET /search/person`                                  |
| Filmes por pessoa (ator ou diretor)          | `GET /discover/movie?with_people={person_id}`         |

A busca (`Tmdb.search()`) chama `/search/movie` e a dupla `/search/person` → `/discover/movie` em paralelo e mescla os resultados — ver [Decisões Técnicas](#-decisões-técnicas).

Documentação completa: [TMDB API Reference](https://developer.themoviedb.org/reference/intro/getting-started)

---

## 📝 Decisões Técnicas

- **Signals em vez de NgRx.** Todo o estado local (loading, resultados, filtros, página atual) usa Angular Signals, não uma store. Motivo prático: é a ferramenta que eu conheço melhor, e a aplicação é pequena — poucas telas, sem estado global complexo compartilhado entre features — então o boilerplate de uma store não se paga aqui. Signals dão reatividade suficiente com bem menos código, e permitem iterar mais rápido.

- **Busca combinada (título + ator + diretor) num campo só.** A TMDB não tem um endpoint que combine busca textual com filtro por pessoa. `Tmdb.search()` dispara duas chamadas em paralelo — `/search/movie` para título, e `/search/person` → `/discover/movie?with_people=` para ator/diretor (a mesma pessoa pode aparecer como elenco ou equipe técnica, então um único `with_people` cobre os dois) — e mescla os resultados removendo duplicatas por id. Trocamos uma UI "mais correta" (com modos de busca separados: título/ator/diretor/categoria) por uma experiência mais simples de usar — um campo só, resultado aproximado, sem problema.

- **Estado da busca na URL, não só em memória.** Filtro (`title`) e página atual (`page`) ficam em query params (`/search?title=...&page=...`), não em signals soltos no componente. Isso faz a busca sobreviver a refresh, ser compartilhável por link e funcionar com o botão voltar do navegador, sem precisar de nenhuma lib de state management.

- **Barra de busca do topo: limpa só ao voltar pra home, preservada em qualquer outra tela.** A barra fixa no topo (`app.html`) não lê `ActivatedRoute.queryParamMap` (isso zeraria o campo em qualquer rota sem `title`, inclusive nos detalhes do filme). Em vez disso, o componente raiz (`App`) escuta `Router.events` filtrando por `NavigationEnd` e decide o valor pelo path exato: em `/` o campo é limpo; em `/search` é preenchido com o `title` da URL; em qualquer outra rota (como `/movie/:id`) o valor atual é mantido intocado. Resultado: abrir um filme a partir de um resultado de busca não apaga o que foi buscado, mas voltar pra home (clicando no logo "Catálogo", já que não há mais botões "voltar" na aplicação) sempre limpa o campo.

- **Toda chamada à TMDB passa por um serviço único.** Nenhum componente monta URL ou `HttpParams` na mão — tudo passa por `Tmdb`, e a `api_key` é injetada automaticamente via `HttpInterceptor` em qualquer request para o domínio da TMDB. Componentes só conhecem métodos semânticos (`getPopularMovies()`, `search()` etc.), nunca a forma da API.

- **Loading com skeleton "estático", não spinner.** Home, detalhes e busca seguem o mesmo padrão: um `<app-skeleton>` reutilizável ocupa exatamente o espaço do conteúdo final enquanto os dados carregam (via `forkJoin`, então tudo aparece de uma vez), em vez de um spinner pequeno que dá lugar a um layout bem maior de repente. Evita o "pulo" de tela ao terminar de carregar.

- **Estratégia de componentização.** Três camadas: `core` (serviços singleton, interceptors, models — zero UI), `shared` (componentes/pipes de UI reaproveitados por mais de uma feature: `movie-card`, `search-bar`, `skeleton`, `pagination`) e `features/*` (uma pasta por tela, com `pages/` para o componente de rota e `components/` para sub-componentes usados só ali — como `banner-carousel` e `movies-carousel` dentro de `home`, ou `cast-list` dentro de `movie-details`). Regra prática usada: se um componente serve mais de uma feature, vai para `shared`; se é específico de uma tela, fica dentro dela.

- **`MoviesCarousel` genérico, com loop infinito, sem paginar a API de novo.** Um único componente (não mais específico de "populares") alimenta todas as seções da home — cada uma mostra sempre a mesma primeira página do endpoint correspondente (não busca mais páginas ao rolar). O efeito de infinito é só visual: a lista é renderizada triplicada (cópia antes + original + depois) e, ao chegar perto do início/fim de uma cópia, a posição de scroll pula instantaneamente pro trecho equivalente da cópia do meio, sem o usuário perceber. Dois detalhes não óbvios encontrados no caminho:
  - A classe `scroll-smooth` (`scroll-behavior: smooth`) faz esse navegador animar até atribuições diretas de `scrollLeft`, não só `scrollTo()`/`scrollBy()` — então esse salto de reposicionamento precisa desligar `scroll-behavior` (`style.scrollBehavior = 'auto'`) por um instante, ou ele fica visivelmente arrastando por vários segundos em vez de ser imperceptível.
  - Mesmo com isso corrigido, a atribuição de `scrollLeft` no primeiro render nem sempre "cola" de primeira em algumas máquinas/versões de Chrome (o container pode ainda não ter terminado de calcular layout naquele instante) — por isso a centralização inicial confere se o valor realmente foi aplicado e tenta de novo no próximo frame até 20 vezes, em vez de assumir que sempre funciona na primeira tentativa.

- **Cada carrossel lembra sua própria posição de scroll horizontal.** `CarouselScrollMemory` é um serviço singleton em memória (chave = título da seção) — cada `MoviesCarousel` salva seu `scrollLeft` no `ngOnDestroy` e o restaura (em vez de centralizar) no próximo mount com o mesmo id. Detalhe não óbvio: ler `scrollLeft` diretamente dentro de `ngOnDestroy` não é confiável — o Angular parece limpar os itens do `@for` antes do hook rodar, o que encolhe o `scrollWidth` e faz o navegador zerar o `scrollLeft` sozinho. A posição salva vem de um valor rastreado continuamente pelo evento `(scroll)`, não de uma leitura do DOM no momento da destruição.

- **Scroll da página (não só dos carrosséis) também é restaurado ao voltar.** O Angular Router já tem restauração de scroll nativa (`withInMemoryScrolling`), mas ela dispara assim que a navegação termina — antes dos dados assíncronos da Home/Busca carregarem e a página atingir a altura final, o que fazia a restauração "ficar curta". A solução: capturar o evento `Scroll` do router (que só carrega uma posição quando é navegação de voltar/avançar) e reaplicar manualmente com `viewportScroller.scrollToPosition()` só depois que os dados chegam e a página já é alta o suficiente pra conter aquela posição — função reaproveitável em `shared/utils/scroll-restoration.ts`, usada tanto na Home quanto na Busca.

- **Tema escuro via `theme-type: dark` do Material, não recolorindo cada componente na mão.** Trocar `theme-type` no `mat.theme()` já ajustou automaticamente botões, ícones, spinner e bordas de input pros tokens corretos — evitando sobrescrever cor por cor manualmente onde o Material já resolve isso sozinho. Por cima disso, o fundo da página é fixado no hex exato do design (`#2e3349`) via CSS puro, já que o tom escuro derivado automaticamente pelo Material não bateria com esse valor específico. O feedback de hover (borda branca) usa `ring` do Tailwind (baseado em `box-shadow`, não `border`) para não deslocar layout nenhum — com o cuidado de aplicar o anel sempre no elemento mais externo não afetado por `overflow-hidden`/`overflow-x-auto` de algum ancestral, já que ambos cortam `box-shadow` que "vaza" pra fora da própria caixa.

- **Módulos por feature com lazy loading, componente raiz standalone.** O scaffold original do projeto usa `NgModule` por feature (mantido, com `loadChildren` lazy), mas o componente raiz (`App`) é standalone — escolha pragmática de manter o padrão herdado do `ng new` em vez de migrar tudo para standalone no meio do desenvolvimento.

---

## 👤 Autor

Desenvolvido por Enzo Russo como parte de um teste técnico.

- GitHub: [@enzorusso](https://github.com/enzorusso)
- LinkedIn: [Enzo Russo](https://linkedin.com/in/enzo-russo)
