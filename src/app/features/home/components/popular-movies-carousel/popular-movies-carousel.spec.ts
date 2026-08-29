import { SimpleChange } from '@angular/core';
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

// Matches the ITEM_WIDTH/ITEM_GAP constants (and the w-40/gap-4 classes) in the component.
function copyWidthFor(movieCount: number): number {
  return movieCount * 160 + Math.max(movieCount - 1, 0) * 16;
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

  it('renders the movie list tripled, so scrolling never hits a hard edge', () => {
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-movie-card').length).toBe(6);
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

  it('centers the scroll position on the middle copy once rendered', () => {
    const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second'), makeMovie(3, 'Third')];
    component.movies = movies;
    fixture.detectChanges();

    expect(component.carousel.nativeElement.scrollLeft).toBe(copyWidthFor(movies.length));
  });

  it('re-centers when the movie list changes', () => {
    component.movies = [makeMovie(1, 'First')];
    fixture.detectChanges();

    const movies = [makeMovie(2, 'A'), makeMovie(3, 'B'), makeMovie(4, 'C'), makeMovie(5, 'D')];
    component.movies = movies;
    component.ngOnChanges({ movies: new SimpleChange(null, movies, false) });

    expect(component.carousel.nativeElement.scrollLeft).toBe(copyWidthFor(movies.length));
  });

  it('does not animate the initial centering (bypasses scroll-behavior: smooth)', () => {
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    fixture.detectChanges();

    expect(component.carousel.nativeElement.style.scrollBehavior).toBe('');
  });

  it('jumps forward into the middle copy when scroll drifts near the start', () => {
    const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.movies = movies;
    fixture.detectChanges();

    const carouselElement = component.carousel.nativeElement;
    const width = copyWidthFor(movies.length);
    carouselElement.scrollLeft = width * 0.1; // well under half a copy

    component.onScroll();

    expect(carouselElement.scrollLeft).toBe(width * 1.1);
  });

  it('jumps backward into the middle copy when scroll drifts near the end', () => {
    const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.movies = movies;
    fixture.detectChanges();

    const carouselElement = component.carousel.nativeElement;
    const width = copyWidthFor(movies.length);
    carouselElement.scrollLeft = width * 2.9; // past 2.5 copies in

    component.onScroll();

    expect(carouselElement.scrollLeft).toBe(width * 1.9);
  });

  it('does nothing on scroll while comfortably within the middle copy', () => {
    const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.movies = movies;
    fixture.detectChanges();

    const carouselElement = component.carousel.nativeElement;
    const width = copyWidthFor(movies.length);
    carouselElement.scrollLeft = width * 1.5;

    component.onScroll();

    expect(carouselElement.scrollLeft).toBe(width * 1.5);
  });
});
