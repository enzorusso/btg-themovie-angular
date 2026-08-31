import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { Movie, PaginatedResponse } from '../../../../core/models/movie';
import { Tmdb } from '../../../../core/services/tmdb';
import { HomeModule } from '../../home-module';
import { Home } from './home';

function paginated(results: Movie[]): PaginatedResponse<Movie> {
  return { page: 1, results, total_pages: 1, total_results: results.length };
}

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;
  let tmdb: Tmdb;

  const popularMovie: Movie = {
    id: 1,
    title: 'Popular Movie',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '2024-01-01',
    vote_average: 8,
    genre_ids: [],
  };

  const upcomingMovie: Movie = { ...popularMovie, id: 2, title: 'Upcoming Movie' };
  const topRatedMovie: Movie = { ...popularMovie, id: 3, title: 'Top Rated Movie' };
  const actionMovie: Movie = { ...popularMovie, id: 4, title: 'Action Movie' };
  const comedyMovie: Movie = { ...popularMovie, id: 5, title: 'Comedy Movie' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    tmdb = TestBed.inject(Tmdb);
  });

  it('loads popular, upcoming, top rated, action and comedy movies on init', () => {
    vi.spyOn(tmdb, 'getPopularMovies').mockReturnValue(of(paginated([popularMovie])));
    vi.spyOn(tmdb, 'getUpcomingMovies').mockReturnValue(of(paginated([upcomingMovie])));
    vi.spyOn(tmdb, 'getTopRatedMovies').mockReturnValue(of(paginated([topRatedMovie])));
    vi.spyOn(tmdb, 'getMoviesByGenre').mockImplementation((genreId) =>
      of(paginated([genreId === 28 ? actionMovie : comedyMovie])),
    );

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.popularMovies()).toEqual([popularMovie]);
    expect(component.upcomingMovies()).toEqual([upcomingMovie]);
    expect(component.topRatedMovies()).toEqual([topRatedMovie]);
    expect(component.actionMovies()).toEqual([actionMovie]);
    expect(component.comedyMovies()).toEqual([comedyMovie]);
    expect(tmdb.getMoviesByGenre).toHaveBeenCalledWith(28);
    expect(tmdb.getMoviesByGenre).toHaveBeenCalledWith(35);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-banner-carousel')).not.toBeNull();
    expect(compiled.querySelectorAll('app-movies-carousel').length).toBe(
      component.sections.length,
    );
    const totalMovies =
      component.popularMovies().length +
      component.topRatedMovies().length +
      component.actionMovies().length +
      component.comedyMovies().length;
    expect(compiled.querySelectorAll('app-movie-card').length).toBe(totalMovies);
    expect(compiled.textContent).toContain('Populares');
    expect(compiled.textContent).toContain('Melhores Avaliados');
    expect(compiled.textContent).toContain('Ação');
    expect(compiled.textContent).toContain('Comédia');
    expect(compiled.querySelector('[data-testid="home-skeleton"]')).toBeNull();
  });

  it('shows a skeleton matching the final layout while the requests are in flight', () => {
    const popularSubject = new Subject<PaginatedResponse<Movie>>();
    const upcomingSubject = new Subject<PaginatedResponse<Movie>>();
    const topRatedSubject = new Subject<PaginatedResponse<Movie>>();
    const actionSubject = new Subject<PaginatedResponse<Movie>>();
    const comedySubject = new Subject<PaginatedResponse<Movie>>();
    vi.spyOn(tmdb, 'getPopularMovies').mockReturnValue(popularSubject.asObservable());
    vi.spyOn(tmdb, 'getUpcomingMovies').mockReturnValue(upcomingSubject.asObservable());
    vi.spyOn(tmdb, 'getTopRatedMovies').mockReturnValue(topRatedSubject.asObservable());
    vi.spyOn(tmdb, 'getMoviesByGenre').mockImplementation((genreId) =>
      (genreId === 28 ? actionSubject : comedySubject).asObservable(),
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="home-skeleton"]')).not.toBeNull();
    expect(compiled.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
    expect(compiled.querySelector('app-banner-carousel')).toBeNull();

    popularSubject.next(paginated([popularMovie]));
    popularSubject.complete();
    upcomingSubject.next(paginated([upcomingMovie]));
    upcomingSubject.complete();
    topRatedSubject.next(paginated([topRatedMovie]));
    topRatedSubject.complete();
    actionSubject.next(paginated([actionMovie]));
    actionSubject.complete();
    comedySubject.next(paginated([comedyMovie]));
    comedySubject.complete();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-testid="home-skeleton"]')).toBeNull();
  });

  it('sets the error state when a request fails', () => {
    vi.spyOn(tmdb, 'getPopularMovies').mockReturnValue(of(paginated([])));
    vi.spyOn(tmdb, 'getUpcomingMovies').mockReturnValue(
      throwError(() => new Error('network error')),
    );
    vi.spyOn(tmdb, 'getTopRatedMovies').mockReturnValue(of(paginated([])));
    vi.spyOn(tmdb, 'getMoviesByGenre').mockReturnValue(of(paginated([])));

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Não foi possível carregar os filmes agora.');
    expect(compiled.querySelector('app-banner-carousel')).toBeNull();
    expect(compiled.querySelector('app-movie-card')).toBeNull();
  });
});
