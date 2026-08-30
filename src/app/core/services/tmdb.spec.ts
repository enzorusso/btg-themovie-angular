import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CreditsResponse } from '../models/credits';
import { PaginatedResponse, Movie } from '../models/movie';
import { Person } from '../models/person';
import { Tmdb } from './tmdb';

function movie(id: number, title = `Movie ${id}`): Movie {
  return {
    id,
    title,
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '2024-01-01',
    vote_average: 7,
    genre_ids: [],
  };
}

describe('Tmdb', () => {
  let service: Tmdb;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Tmdb);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches movie credits from /movie/{id}/credits', () => {
    const mockResponse: CreditsResponse = { id: 550, cast: [], crew: [] };

    service.getMovieCredits(550).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.tmdbBaseUrl}/movie/550/credits`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('searches people from /search/person', () => {
    const mockResponse: PaginatedResponse<Person> = {
      page: 1,
      results: [{ id: 287, name: 'Brad Pitt' }],
      total_pages: 1,
      total_results: 1,
    };

    service.searchPerson('Brad Pitt').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.tmdbBaseUrl}/search/person`);
    expect(req.request.params.get('query')).toBe('Brad Pitt');
    req.flush(mockResponse);
  });

  it('sends with_people to /discover/movie when provided', () => {
    service.discoverMovies({ withPeople: 287 }, 2).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${environment.tmdbBaseUrl}/discover/movie`);
    expect(req.request.params.get('with_people')).toBe('287');
    expect(req.request.params.get('page')).toBe('2');
    req.flush({ page: 2, results: [], total_pages: 2, total_results: 0 });
  });

  it('omits with_people from /discover/movie when not provided', () => {
    service.discoverMovies({}).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${environment.tmdbBaseUrl}/discover/movie`);
    expect(req.request.params.get('with_people')).toBeNull();
    req.flush({ page: 1, results: [], total_pages: 1, total_results: 0 });
  });

  it('fetches movies by genre, sorted by popularity, from /discover/movie', () => {
    const mockResponse: PaginatedResponse<Movie> = {
      page: 1,
      results: [movie(1)],
      total_pages: 1,
      total_results: 1,
    };

    service.getMoviesByGenre(28).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.tmdbBaseUrl}/discover/movie`);
    expect(req.request.params.get('with_genres')).toBe('28');
    expect(req.request.params.get('sort_by')).toBe('popularity.desc');
    req.flush(mockResponse);
  });

  describe('search', () => {
    it('returns an empty page without any HTTP call for a blank query', () => {
      service.search('   ').subscribe((response) => {
        expect(response).toEqual({ page: 1, results: [], total_pages: 0, total_results: 0 });
      });

      httpMock.expectNone(() => true);
    });

    it('combines the title search with a person (cast or crew) discover search', () => {
      service.search('homem aranha', 1).subscribe((response) => {
        expect(response.results.map((m) => m.id)).toEqual([1, 2]);
      });

      const titleReq = httpMock.expectOne((r) => r.url === `${environment.tmdbBaseUrl}/search/movie`);
      expect(titleReq.request.params.get('query')).toBe('homem aranha');
      titleReq.flush({ page: 1, results: [movie(1, 'Homem-Aranha')], total_pages: 2, total_results: 1 });

      const personReq = httpMock.expectOne(
        (r) => r.url === `${environment.tmdbBaseUrl}/search/person`,
      );
      expect(personReq.request.params.get('query')).toBe('homem aranha');
      personReq.flush({
        page: 1,
        results: [{ id: 99, name: 'Tobey Maguire' }],
        total_pages: 1,
        total_results: 1,
      });

      const discoverReq = httpMock.expectOne(
        (r) => r.url === `${environment.tmdbBaseUrl}/discover/movie`,
      );
      expect(discoverReq.request.params.get('with_people')).toBe('99');
      discoverReq.flush({
        page: 1,
        results: [movie(2, 'Spider-Man')],
        total_pages: 1,
        total_results: 1,
      });
    });

    it('de-duplicates movies that match both the title and the person search', () => {
      service.search('homem aranha').subscribe((response) => {
        expect(response.results.map((m) => m.id)).toEqual([1]);
        expect(response.total_pages).toBe(2);
      });

      const titleReq = httpMock.expectOne((r) => r.url === `${environment.tmdbBaseUrl}/search/movie`);
      titleReq.flush({ page: 1, results: [movie(1)], total_pages: 2, total_results: 1 });

      const personReq = httpMock.expectOne(
        (r) => r.url === `${environment.tmdbBaseUrl}/search/person`,
      );
      personReq.flush({
        page: 1,
        results: [{ id: 99, name: 'Someone' }],
        total_pages: 1,
        total_results: 1,
      });

      const discoverReq = httpMock.expectOne(
        (r) => r.url === `${environment.tmdbBaseUrl}/discover/movie`,
      );
      discoverReq.flush({ page: 1, results: [movie(1)], total_pages: 1, total_results: 1 });
    });

    it('falls back to title-only results when no person matches the query', () => {
      service.search('matrix').subscribe((response) => {
        expect(response.results.map((m) => m.id)).toEqual([1]);
      });

      const titleReq = httpMock.expectOne((r) => r.url === `${environment.tmdbBaseUrl}/search/movie`);
      titleReq.flush({ page: 1, results: [movie(1)], total_pages: 1, total_results: 1 });

      const personReq = httpMock.expectOne(
        (r) => r.url === `${environment.tmdbBaseUrl}/search/person`,
      );
      personReq.flush({ page: 1, results: [], total_pages: 1, total_results: 0 });

      httpMock.expectNone((r) => r.url === `${environment.tmdbBaseUrl}/discover/movie`);
    });
  });
});
