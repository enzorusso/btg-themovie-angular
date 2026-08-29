import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Movie } from '../../../../core/models/movie';
import { HomeModule } from '../../home-module';
import { PopularMoviesCarousel } from './popular-movies-carousel';

function makeMovie(id: number, title: string): Movie {
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

describe('PopularMoviesCarousel', () => {
  let fixture: ComponentFixture<PopularMoviesCarousel>;
  let component: PopularMoviesCarousel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularMoviesCarousel);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a movie card for each movie', () => {
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-movie-card').length).toBe(2);
    expect(compiled.textContent).toContain('First');
    expect(compiled.textContent).toContain('Second');
  });

  it('scrolls the carousel left and right', () => {
    component.movies = [makeMovie(1, 'First')];
    fixture.detectChanges();

    const scrollBy = vi.fn();
    component.carousel.nativeElement.scrollBy = scrollBy;

    component.scrollRight();
    expect(scrollBy).toHaveBeenCalledWith({ left: 500, behavior: 'smooth' });

    component.scrollLeft();
    expect(scrollBy).toHaveBeenCalledWith({ left: -500, behavior: 'smooth' });
  });
});
