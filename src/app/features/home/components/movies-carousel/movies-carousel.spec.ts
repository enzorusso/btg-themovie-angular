import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Movie } from '../../../../core/models/movie';
import { HomeModule } from '../../home-module';
import { MoviesCarousel } from './movies-carousel';

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

/** jsdom doesn't lay out content, so scrollWidth/clientWidth default to 0 — stub them per test. */
function setLayout(
  el: HTMLElement,
  { scrollWidth, clientWidth }: { scrollWidth: number; clientWidth: number },
): void {
  Object.defineProperty(el, 'scrollWidth', { value: scrollWidth, configurable: true });
  Object.defineProperty(el, 'clientWidth', { value: clientWidth, configurable: true });
}

describe('MoviesCarousel', () => {
  let fixture: ComponentFixture<MoviesCarousel>;
  let component: MoviesCarousel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesCarousel);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders each movie exactly once', () => {
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

  describe('scroll button state', () => {
    it('disables the left button and enables the right one at the start of an overflowing list', () => {
      component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
      fixture.detectChanges();

      const el = component.carousel.nativeElement;
      setLayout(el, { scrollWidth: 1000, clientWidth: 400 });
      el.scrollLeft = 0;
      component.onScroll();

      expect(component.canScrollLeft()).toBe(false);
      expect(component.canScrollRight()).toBe(true);
    });

    it('enables the left button and disables the right one at the end of the list', () => {
      component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
      fixture.detectChanges();

      const el = component.carousel.nativeElement;
      setLayout(el, { scrollWidth: 1000, clientWidth: 400 });
      el.scrollLeft = 600; // scrollLeft + clientWidth === scrollWidth
      component.onScroll();

      expect(component.canScrollLeft()).toBe(true);
      expect(component.canScrollRight()).toBe(false);
    });

    it('disables both buttons when every item already fits without overflow', () => {
      component.movies = [makeMovie(1, 'First')];
      fixture.detectChanges();

      const el = component.carousel.nativeElement;
      setLayout(el, { scrollWidth: 200, clientWidth: 400 });
      el.scrollLeft = 0;
      component.onScroll();

      expect(component.canScrollLeft()).toBe(false);
      expect(component.canScrollRight()).toBe(false);
    });

    it('reflects the disabled state on the actual buttons in the DOM', () => {
      component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
      fixture.detectChanges();

      const el = component.carousel.nativeElement;
      setLayout(el, { scrollWidth: 1000, clientWidth: 400 });
      el.scrollLeft = 0;
      component.onScroll();
      fixture.detectChanges();

      const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
      expect(buttons[0].disabled).toBe(true);
      expect(buttons[1].disabled).toBe(false);
    });

    it('recomputes button state once the movie list arrives asynchronously', () => {
      fixture.detectChanges(); // view initializes before movies arrive

      const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
      component.movies = movies;
      const el = component.carousel.nativeElement;
      setLayout(el, { scrollWidth: 1000, clientWidth: 400 });
      component.ngOnChanges({ movies: new SimpleChange(null, movies, false) });

      expect(component.canScrollRight()).toBe(true);
    });
  });

  describe('scroll position memory', () => {
    it('restores the remembered scroll position on mount, without animating', () => {
      const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];

      component.id = 'populares';
      component.movies = movies;
      fixture.detectChanges();
      component.carousel.nativeElement.scrollLeft = 320;
      component.onScroll(); // tracks lastKnownScrollLeft, mirroring the real (scroll) event

      fixture.destroy();

      const fixture2 = TestBed.createComponent(MoviesCarousel);
      const component2 = fixture2.componentInstance;
      component2.id = 'populares';
      component2.movies = movies;
      fixture2.detectChanges();

      expect(component2.carousel.nativeElement.scrollLeft).toBe(320);
      expect(component2.carousel.nativeElement.style.scrollBehavior).toBe('');
    });

    it('keeps remembered positions independent per id', () => {
      const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];

      component.id = 'populares';
      component.movies = movies;
      fixture.detectChanges();
      component.carousel.nativeElement.scrollLeft = 200;
      component.onScroll();
      fixture.destroy();

      const fixture2 = TestBed.createComponent(MoviesCarousel);
      const component2 = fixture2.componentInstance;
      component2.id = 'acao';
      component2.movies = movies;
      fixture2.detectChanges();

      // no memory saved for "acao" yet, so it just stays at the start
      expect(component2.carousel.nativeElement.scrollLeft).toBe(0);
    });

    it('starts at the beginning when no id is provided (nothing to remember by)', () => {
      const movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];

      component.movies = movies;
      fixture.detectChanges();
      component.carousel.nativeElement.scrollLeft = 200;
      component.onScroll();
      fixture.destroy();

      const fixture2 = TestBed.createComponent(MoviesCarousel);
      const component2 = fixture2.componentInstance;
      component2.movies = movies;
      fixture2.detectChanges();

      expect(component2.carousel.nativeElement.scrollLeft).toBe(0);
    });
  });
});
