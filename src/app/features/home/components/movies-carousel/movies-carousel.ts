import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CarouselScrollMemory } from '../../../../core/services/carousel-scroll-memory';
import { Movie } from '../../../../core/models/movie';

const ITEM_WIDTH = 160;
const ITEM_GAP = 16;

@Component({
  selector: 'app-movies-carousel',
  standalone: false,
  templateUrl: './movies-carousel.html',
  styleUrl: './movies-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesCarousel implements OnChanges, AfterViewInit, OnDestroy {
  @Input() movies: Movie[] = [];
  /** Identifies this carousel for scroll-position memory (e.g. the section title). */
  @Input() id = '';

  @ViewChild('carousel')
  carousel!: ElementRef<HTMLDivElement>;

  private readonly scrollMemory = inject(CarouselScrollMemory);

  private readonly scrollAmount = 500;

  /**
   * Tracked continuously from the (scroll) event rather than read from the
   * DOM at destroy time — by the time ngOnDestroy runs, Angular may have
   * already cleared the @for'd items, which collapses scrollWidth and makes
   * the browser clamp scrollLeft back to 0.
   */
  private lastKnownScrollLeft = 0;

  get loopedMovies(): Movie[] {
    return [...this.movies, ...this.movies, ...this.movies];
  }

  private get copyWidth(): number {
    const count = this.movies.length;
    return count * ITEM_WIDTH + Math.max(count - 1, 0) * ITEM_GAP;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movies'] && this.carousel) {
      this.centerScroll();
    }
  }

  ngAfterViewInit(): void {
    this.centerScroll();
  }

  ngOnDestroy(): void {
    if (this.id) {
      this.scrollMemory.save(this.id, this.lastKnownScrollLeft);
    }
  }

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth',
    });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth',
    });
  }

  onScroll(): void {
    if (this.movies.length === 0) {
      return;
    }

    const carouselElement = this.carousel.nativeElement;
    const width = this.copyWidth;

    if (carouselElement.scrollLeft < width * 0.5) {
      this.setScrollLeftInstantly(carouselElement.scrollLeft + width);
    } else if (carouselElement.scrollLeft > width * 2.5) {
      this.setScrollLeftInstantly(carouselElement.scrollLeft - width);
    }

    this.lastKnownScrollLeft = carouselElement.scrollLeft;
  }

  private centerScroll(): void {
    if (this.movies.length === 0) {
      return;
    }

    const remembered = this.id ? this.scrollMemory.get(this.id) : undefined;
    this.setScrollLeftInstantly(remembered ?? this.copyWidth);
  }

  private setScrollLeftInstantly(value: number): void {
    const carouselElement = this.carousel.nativeElement;
    const previousScrollBehavior = carouselElement.style.scrollBehavior;
    carouselElement.style.scrollBehavior = 'auto';
    carouselElement.scrollLeft = value;
    carouselElement.style.scrollBehavior = previousScrollBehavior;
    this.lastKnownScrollLeft = value;
  }
}
