import { Location } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { CreditsResponse } from '../../../../core/models/credits';
import { MovieDetails as MovieDetailsModel } from '../../../../core/models/movie';
import { Tmdb } from '../../../../core/services/tmdb';
import { MovieDetailsModule } from '../../movie-details-module';
import { MovieDetails } from './movie-details';

describe('MovieDetails', () => {
  let fixture: ComponentFixture<MovieDetails>;
  let component: MovieDetails;
  let tmdb: Tmdb;

  const movie: MovieDetailsModel = {
    id: 550,
    title: 'Fight Club',
    overview: 'An insomniac office worker...',
    poster_path: '/poster.jpg',
    backdrop_path: null,
    release_date: '1999-10-15',
    vote_average: 8.4,
    genres: [{ id: 18, name: 'Drama' }],
    runtime: 139,
    tagline: 'Mischief. Mayhem. Soap.',
  };

  const credits: CreditsResponse = {
    id: 550,
    cast: [{ id: 1, name: 'Brad Pitt', character: 'Tyler Durden', profile_path: null, order: 0 }],
    crew: [{ id: 2, name: 'David Fincher', job: 'Director', department: 'Directing' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '550' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetails);
    component = fixture.componentInstance;
    tmdb = TestBed.inject(Tmdb);
  });

  it('loads movie details, cast and director on init', () => {
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(of(movie));
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(of(credits));

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.movie()).toEqual(movie);
    expect(component.cast()).toEqual(credits.cast);
    expect(component.director()).toBe('David Fincher');
  });

  it('sets the error state when a request fails', () => {
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(throwError(() => new Error('not found')));
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(of(credits));

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(true);
  });

  it('renders the movie details, director, and cast in the DOM on success', () => {
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(of(movie));
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(of(credits));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Fight Club');
    expect(compiled.textContent).toContain('David Fincher');
    expect(compiled.querySelector('app-cast-list')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="movie-details-skeleton"]')).toBeNull();
  });

  it('renders an error message when a request fails', () => {
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(throwError(() => new Error('not found')));
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(of(credits));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Não foi possível carregar os detalhes deste filme.');
  });

  it('renders a back button', () => {
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(of(movie));
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(of(credits));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button[aria-label="Voltar"]')).not.toBeNull();
  });

  it('navigates back through browser history when the back button is clicked', () => {
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(of(movie));
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(of(credits));
    const location = TestBed.inject(Location);
    const backSpy = vi.spyOn(location, 'back').mockImplementation(() => {});

    fixture.detectChanges();
    component.goBack();

    expect(backSpy).toHaveBeenCalled();
  });

  it('shows a skeleton matching the final layout while the requests are in flight', () => {
    const detailsSubject = new Subject<MovieDetailsModel>();
    const creditsSubject = new Subject<CreditsResponse>();
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(detailsSubject.asObservable());
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(creditsSubject.asObservable());

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="movie-details-skeleton"]')).not.toBeNull();
    expect(compiled.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);

    detailsSubject.next(movie);
    detailsSubject.complete();
    creditsSubject.next(credits);
    creditsSubject.complete();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-testid="movie-details-skeleton"]')).toBeNull();
  });

  it('omits the director line when no crew member has the Director job', () => {
    const creditsWithoutDirector: CreditsResponse = {
      id: 550,
      cast: credits.cast,
      crew: [{ id: 3, name: 'Someone Else', job: 'Producer', department: 'Production' }],
    };
    vi.spyOn(tmdb, 'getMovieDetails').mockReturnValue(of(movie));
    vi.spyOn(tmdb, 'getMovieCredits').mockReturnValue(of(creditsWithoutDirector));

    fixture.detectChanges();

    expect(component.director()).toBeNull();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Diretor:');
  });
});
