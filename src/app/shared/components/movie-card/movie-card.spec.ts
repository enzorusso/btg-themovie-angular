import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Movie } from '../../../core/models/movie';
import { SharedModule } from '../../shared-module';
import { MovieCard } from './movie-card';

describe('MovieCard', () => {
  let fixture: ComponentFixture<MovieCard>;
  let component: MovieCard;

  const movie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: '',
    poster_path: '/poster.jpg',
    backdrop_path: null,
    release_date: '2024-01-01',
    vote_average: 7.8,
    genre_ids: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCard);
    component = fixture.componentInstance;
    component.movie = movie;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the movie title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Movie');
  });

  it('renders the poster image when a poster_path is present', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img?.getAttribute('src')).toContain('/poster.jpg');
    expect(img?.getAttribute('alt')).toBe('Test Movie');
  });

  it('renders a fallback icon when there is no poster_path', () => {
    fixture.componentRef.setInput('movie', { ...movie, poster_path: null });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img')).toBeNull();
    expect(compiled.querySelector('mat-icon')?.textContent?.trim()).toBe('movie');
  });
});
