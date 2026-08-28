# 🎬 Catálogo de Filmes

Aplicação front-end desenvolvida em Angular que consome a API pública do [TheMovieDB (TMDB)](https://www.themoviedb.org/documentation/api) para exibir filmes populares, lançamentos e permitir busca e visualização de detalhes.

---

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um teste técnico, com o objetivo de demonstrar boas práticas de desenvolvimento front-end com Angular, organização de código, componentização e consumo de API externa.

### Funcionalidades

- ✅ **Listagem de Filmes Populares** — exibe capa, título e avaliação média dos filmes mais populares do momento.
- ✅ **Filmes a serem Lançados** — banner na tela inicial com os próximos lançamentos.
- ✅ **Busca de Filmes** — pesquisa por título, ator, diretor, ano de lançamento e categoria, com listagem dos resultados.
- ✅ **Detalhes do Filme** — título, sinopse, gêneros, data de lançamento, avaliação média e pôster em alta resolução.
- ✅ **Navegação** — utilização do Angular Router entre as telas de listagem, busca e detalhes.
- ✅ **Componentização** — responsabilidades separadas em componentes reutilizáveis (lista, card de filme, busca, detalhes, etc).

### Diferenciais implementados

- [ ] Paginação na listagem de filmes
- [ ] Testes unitários
- [ ] Deploy (Vercel / Netlify / GitHub Pages)
- [ ] State Management (NgRx ou Signals)
- [ ] Lazy Loading e modularização
- [ ] Interface responsiva
- [ ] Localização (Inglês e Português)
- [ ] Filmes por categoria

---

## 🚀 Tecnologias Utilizadas

- [Angular](https://angular.dev/) 18+
- TypeScript
- HTML5 / SCSS
- [TheMovieDB API](https://developer.themoviedb.org/reference/intro/getting-started)

### Bibliotecas externas

> Preencha esta seção com as bibliotecas adicionais utilizadas no projeto (ex.: Angular Material, RxJS extras, etc).

| Biblioteca             | Por que foi usada                            | Benefícios trazidos                                      |
| ---------------------- | -------------------------------------------- | -------------------------------------------------------- |
| _ex: Angular Material_ | _ex: componentes de UI prontos e acessíveis_ | _ex: agilidade no desenvolvimento e consistência visual_ |

---

## 🔧 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Angular CLI](https://angular.dev/tools/cli) (versão 18+)

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
git clone https://github.com/seu-usuario/catalogo-de-filmes.git
cd catalogo-de-filmes
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

Executa os testes unitários através do [Karma](https://karma-runner.github.io).

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                  # Serviços singleton, interceptors, models
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── home/              # Tela inicial (populares + banner de lançamentos)
│   │   ├── search/            # Busca de filmes
│   │   └── movie-details/     # Detalhes do filme
│   ├── shared/                # Componentes reutilizáveis (movie-card, header, etc)
│   ├── app.routes.ts
│   └── app.component.ts
├── environments/
└── assets/
```

---

## 🌐 Endpoints da API utilizados

| Funcionalidade          | Endpoint TMDB           |
| ----------------------- | ----------------------- |
| Filmes populares        | `GET /movie/popular`    |
| Filmes a serem lançados | `GET /movie/upcoming`   |
| Busca de filmes         | `GET /search/movie`     |
| Detalhes do filme       | `GET /movie/{movie_id}` |
| Gêneros                 | `GET /genre/movie/list` |

Documentação completa: [TMDB API Reference](https://developer.themoviedb.org/reference/intro/getting-started)

---

## 📝 Decisões Técnicas

> Espaço para justificar escolhas de arquitetura, padrões de projeto, uso de Signals vs NgRx, estratégia de componentização, etc.

- ...
- ...

---

## 👤 Autor

Desenvolvido por Enzo Russo como parte de um teste técnico.

- GitHub: [@enzorusso](https://github.com/enzorusso)
- LinkedIn: [Enzo Russo](https://linkedin.com/in/enzo-russo)
