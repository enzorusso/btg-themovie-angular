import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Movie } from '../../../../core/models/movie';
import { HomeModule } from '../../home-module';
import { BannerCarousel } from './banner-carousel';

function makeMovie(
  id: number,
  title: string,
  backdropPath: string | null = '/backdrop.jpg',
  posterPath: string | null = null,
): Movie {
  return {
    id,
    title,
    overview: '',
    poster_path: posterPath,
    backdrop_path: backdropPath,
    release_date: '2024-01-01',
    vote_average: 7,
    genre_ids: [],
  };
}

/** Stubs the `Image` global so prefetching can be asserted without a real network request. */
function stubImagePrefetch(): string[] {
  const requestedUrls: string[] = [];
  vi.stubGlobal(
    'Image',
    class {
      set src(value: string) {
        requestedUrls.push(value);
      }
    },
  );
  return requestedUrls;
}

describe('BannerCarousel', () => {
  let fixture: ComponentFixture<BannerCarousel>;
  let component: BannerCarousel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerCarousel);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('advances to the next slide automatically every 5 seconds', () => {
    vi.useFakeTimers();
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });

    expect(component.currentIndex()).toBe(0);

    vi.advanceTimersByTime(5000);

    expect(component.currentIndex()).toBe(1);
  });

  it('jumps to the clicked slide via goTo', () => {
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second'), makeMovie(3, 'Third')];

    component.goTo(2);

    expect(component.currentIndex()).toBe(2);
  });

  it('resets the autoplay timer when navigating manually via goTo', () => {
    vi.useFakeTimers();
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second'), makeMovie(3, 'Third')];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });

    vi.advanceTimersByTime(3000);
    component.goTo(1);

    vi.advanceTimersByTime(3000); // 3s since goTo — should NOT have auto-advanced yet (would need 5s)
    expect(component.currentIndex()).toBe(1);

    vi.advanceTimersByTime(2000); // now 5s since goTo — should auto-advance
    expect(component.currentIndex()).toBe(2);
  });

  it('renders a dot per movie and the current slide title', () => {
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dots = compiled.querySelectorAll('button');

    expect(dots.length).toBe(2);
    expect(compiled.textContent).toContain('First');
  });

  it('updates currentIndex when a dot button is clicked', () => {
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second'), makeMovie(3, 'Third')];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dots = compiled.querySelectorAll('button');
    dots[2].dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(2);
  });

  it('links the current slide to its movie details page', () => {
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');

    expect(link?.getAttribute('href')).toBe('/movie/1');
  });

  it('pauses autoplay while the mouse is over the banner', () => {
    vi.useFakeTimers();
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector('.relative')!.dispatchEvent(new Event('mouseenter'));

    vi.advanceTimersByTime(10000); // well past the 5s interval

    expect(component.currentIndex()).toBe(0);
  });

  it('resumes autoplay once the mouse leaves the banner', () => {
    vi.useFakeTimers();
    component.movies = [makeMovie(1, 'First'), makeMovie(2, 'Second')];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const banner = compiled.querySelector('.relative')!;
    banner.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(10000);
    expect(component.currentIndex()).toBe(0);

    banner.dispatchEvent(new Event('mouseleave'));
    vi.advanceTimersByTime(5000);

    expect(component.currentIndex()).toBe(1);
  });

  it('renders a fallback icon when the current movie has no backdrop_path', () => {
    component.movies = [makeMovie(1, 'First', null)];
    component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('img')).toBeNull();
    expect(compiled.querySelector('mat-icon')?.textContent?.trim()).toBe('movie');
  });

  describe('poster prefetching', () => {
    it('prefetches the details-page poster of the current slide once the movies arrive', () => {
      const requestedUrls = stubImagePrefetch();

      component.movies = [makeMovie(1, 'First', '/backdrop.jpg', '/poster1.jpg')];
      component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });

      expect(requestedUrls).toEqual(['https://image.tmdb.org/t/p/w780/poster1.jpg']);
    });

    it('does not attempt to prefetch when the current movie has no poster_path', () => {
      const requestedUrls = stubImagePrefetch();

      component.movies = [makeMovie(1, 'First', '/backdrop.jpg', null)];
      component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });

      expect(requestedUrls).toEqual([]);
    });

    it('prefetches the newly selected slide poster when navigating via goTo', () => {
      component.movies = [
        makeMovie(1, 'First', '/backdrop.jpg', '/poster1.jpg'),
        makeMovie(2, 'Second', '/backdrop.jpg', '/poster2.jpg'),
      ];
      component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });

      const requestedUrls = stubImagePrefetch();
      component.goTo(1);

      expect(requestedUrls).toEqual(['https://image.tmdb.org/t/p/w780/poster2.jpg']);
    });

    it('prefetches the next slide poster on every autoplay tick', () => {
      vi.useFakeTimers();
      component.movies = [
        makeMovie(1, 'First', '/backdrop.jpg', '/poster1.jpg'),
        makeMovie(2, 'Second', '/backdrop.jpg', '/poster2.jpg'),
      ];
      component.ngOnChanges({ movies: new SimpleChange(undefined, component.movies, true) });

      const requestedUrls = stubImagePrefetch();
      vi.advanceTimersByTime(5000);

      expect(requestedUrls).toEqual(['https://image.tmdb.org/t/p/w780/poster2.jpg']);
    });
  });
});
