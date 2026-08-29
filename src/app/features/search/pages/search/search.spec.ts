import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { Movie, PaginatedResponse } from '../../../../core/models/movie';
import { Tmdb } from '../../../../core/services/tmdb';
import { SearchModule } from '../../search-module';
import { Search } from './search';

function movie(id: number, title: string): Movie {
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

function paginated(results: Movie[], totalPages = 1): PaginatedResponse<Movie> {
  return { page: 1, results, total_pages: totalPages, total_results: results.length };
}

describe('Search', () => {
  let fixture: ComponentFixture<Search>;
  let component: Search;
  let tmdb: Tmdb;
  let router: Router;
  let queryParamMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  async function setup(params: Record<string, string> = {}) {
    queryParamMap$ = new BehaviorSubject(convertToParamMap(params));

    await TestBed.configureTestingModule({
      imports: [SearchModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: queryParamMap$.asObservable() },
        },
      ],
    }).compileComponents();

    tmdb = TestBed.inject(Tmdb);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
  }

  it('should create', async () => {
    await setup();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('renders a back link to the home page', async () => {
    await setup();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[aria-label="Voltar"]');
    expect(link?.getAttribute('href')).toBe('/');
  });

  it('shows a prompt when there is no "title" query param yet', async () => {
    await setup();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Preencha o campo de busca no topo da página.');
  });

  it('searches by the "title" query param and renders results', async () => {
    await setup({ title: 'homem aranha' });
    vi.spyOn(tmdb, 'search').mockReturnValue(of(paginated([movie(1, 'Homem-Aranha')])));

    fixture.detectChanges();

    expect(tmdb.search).toHaveBeenCalledWith('homem aranha', 1);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Homem-Aranha');
  });

  it('shows a skeleton matching the results grid while the search is in flight', async () => {
    await setup({ title: 'matrix' });
    const subject = new Subject<PaginatedResponse<Movie>>();
    vi.spyOn(tmdb, 'search').mockReturnValue(subject.asObservable());

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="search-skeleton"]')).not.toBeNull();

    subject.next(paginated([movie(1, 'The Matrix')]));
    subject.complete();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-testid="search-skeleton"]')).toBeNull();
  });

  it('shows an empty state when the search returns no movies', async () => {
    await setup({ title: 'zzz' });
    vi.spyOn(tmdb, 'search').mockReturnValue(of(paginated([])));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nenhum filme encontrado para "zzz".');
  });

  it('shows an error message when the search fails', async () => {
    await setup({ title: 'matrix' });
    vi.spyOn(tmdb, 'search').mockReturnValue(throwError(() => new Error('network error')));

    fixture.detectChanges();

    expect(component.error()).toBe(true);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Não foi possível buscar filmes agora.');
  });

  it('re-searches when the page query param changes', async () => {
    await setup({ title: 'matrix', page: '1' });
    vi.spyOn(tmdb, 'search').mockReturnValue(of(paginated([movie(1, 'The Matrix')], 3)));

    fixture.detectChanges();
    expect(tmdb.search).toHaveBeenCalledWith('matrix', 1);

    queryParamMap$.next(convertToParamMap({ title: 'matrix', page: '2' }));
    fixture.detectChanges();

    expect(tmdb.search).toHaveBeenCalledWith('matrix', 2);
  });

  it('navigates preserving the current query when the page changes', async () => {
    await setup({ title: 'matrix' });
    vi.spyOn(tmdb, 'search').mockReturnValue(of(paginated([movie(1, 'The Matrix')], 3)));
    fixture.detectChanges();

    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onPageChange(2);

    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { page: 2 },
        queryParamsHandling: 'merge',
      }),
    );
  });
});
