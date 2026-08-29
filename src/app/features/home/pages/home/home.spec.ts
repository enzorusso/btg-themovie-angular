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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    tmdb = TestBed.inject(Tmdb);
  });

  it('loads popular and upcoming movies on init', () => {
    vi.spyOn(tmdb, 'getPopularMovies').mockReturnValue(of(paginated([popularMovie])));
    vi.spyOn(tmdb, 'getUpcomingMovies').mockReturnValue(of(paginated([upcomingMovie])));

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.popularMovies()).toEqual([popularMovie]);
    expect(component.upcomingMovies()).toEqual([upcomingMovie]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-banner-carousel')).not.toBeNull();
    // the popular carousel loops, rendering the list three times back-to-back
    expect(compiled.querySelectorAll('app-movie-card').length).toBe(
      component.popularMovies().length * 3,
    );
    expect(compiled.querySelector('[data-testid="home-skeleton"]')).toBeNull();
  });

  it('shows a skeleton matching the final layout while the requests are in flight', () => {
    const popularSubject = new Subject<PaginatedResponse<Movie>>();
    const upcomingSubject = new Subject<PaginatedResponse<Movie>>();
    vi.spyOn(tmdb, 'getPopularMovies').mockReturnValue(popularSubject.asObservable());
    vi.spyOn(tmdb, 'getUpcomingMovies').mockReturnValue(upcomingSubject.asObservable());

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="home-skeleton"]')).not.toBeNull();
    expect(compiled.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
    expect(compiled.querySelector('app-banner-carousel')).toBeNull();

    popularSubject.next(paginated([popularMovie]));
    popularSubject.complete();
    upcomingSubject.next(paginated([upcomingMovie]));
    upcomingSubject.complete();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-testid="home-skeleton"]')).toBeNull();
  });

  it('sets the error state when a request fails', () => {
    vi.spyOn(tmdb, 'getPopularMovies').mockReturnValue(of(paginated([])));
    vi.spyOn(tmdb, 'getUpcomingMovies').mockReturnValue(
      throwError(() => new Error('network error')),
    );

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Não foi possível carregar os filmes agora.');
    expect(compiled.querySelector('app-banner-carousel')).toBeNull();
    expect(compiled.querySelector('app-movie-card')).toBeNull();
  });
});
