import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Movie, MovieDetails, PaginatedResponse } from '../models/movie';
import { environment } from '../../../environments/environment.development';
import { CreditsResponse } from '../models/credits';
import { Person } from '../models/person';

interface DiscoverFilters {
  withPeople?: number;
}

const EMPTY_PAGE: PaginatedResponse<Movie> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

function mergeUnique(
  a: PaginatedResponse<Movie>,
  b: PaginatedResponse<Movie>,
): PaginatedResponse<Movie> {
  const seen = new Set<number>();
  const results: Movie[] = [];

  for (const movie of [...a.results, ...b.results]) {
    if (!seen.has(movie.id)) {
      seen.add(movie.id);
      results.push(movie);
    }
  }

  return {
    page: a.page,
    results,
    total_pages: Math.max(a.total_pages, b.total_pages),
    total_results: a.total_results + b.total_results,
  };
}

@Service()
export class Tmdb {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;

  getPopularMovies(page = 1): Observable<PaginatedResponse<Movie>> {
    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/movie/popular`, {
      params: new HttpParams().set('page', page).set('language', 'pt-BR'),
    });
  }

  getUpcomingMovies(page = 1): Observable<PaginatedResponse<Movie>> {
    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/movie/upcoming`, {
      params: new HttpParams().set('page', page).set('language', 'pt-BR'),
    });
  }

  getTopRatedMovies(page = 1): Observable<PaginatedResponse<Movie>> {
    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/movie/top_rated`, {
      params: new HttpParams().set('page', page).set('language', 'pt-BR'),
    });
  }

  searchMovies(query: string, page = 1): Observable<PaginatedResponse<Movie>> {
    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/search/movie`, {
      params: new HttpParams().set('query', query).set('page', page).set('language', 'pt-BR'),
    });
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${movieId}`, {
      params: {
        language: 'pt-BR',
      },
    });
  }

  getMovieCredits(movieId: number): Observable<CreditsResponse> {
    return this.http.get<CreditsResponse>(`${this.baseUrl}/movie/${movieId}/credits`);
  }

  searchPerson(query: string, page = 1): Observable<PaginatedResponse<Person>> {
    return this.http.get<PaginatedResponse<Person>>(`${this.baseUrl}/search/person`, {
      params: new HttpParams().set('query', query).set('page', page),
    });
  }

  discoverMovies(filters: DiscoverFilters, page = 1): Observable<PaginatedResponse<Movie>> {
    let params = new HttpParams().set('page', page).set('language', 'pt-BR');

    if (filters.withPeople) {
      params = params.set('with_people', filters.withPeople);
    }

    return this.http.get<PaginatedResponse<Movie>>(`${this.baseUrl}/discover/movie`, { params });
  }

  search(query: string, page = 1): Observable<PaginatedResponse<Movie>> {
    const trimmed = query.trim();
    if (!trimmed) {
      return of(EMPTY_PAGE);
    }

    return forkJoin({
      byTitle: this.searchMovies(trimmed, page),
      byPerson: this.resolvePerson(trimmed).pipe(
        switchMap((person) =>
          person ? this.discoverMovies({ withPeople: person.id }, page) : of(EMPTY_PAGE),
        ),
      ),
    }).pipe(map(({ byTitle, byPerson }) => mergeUnique(byTitle, byPerson)));
  }

  private resolvePerson(name: string): Observable<Person | null> {
    return this.searchPerson(name).pipe(map((response) => response.results[0] ?? null));
  }
}
