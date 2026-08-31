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
  signal,
  ViewChild,
} from '@angular/core';
import { CarouselScrollMemory } from '../../../../core/services/carousel-scroll-memory';
import { Movie } from '../../../../core/models/movie';

@Component({
  selector: 'app-movies-carousel',
  standalone: false,
  templateUrl: './movies-carousel.html',
  styleUrl: './movies-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesCarousel implements OnChanges, AfterViewInit, OnDestroy {
  @Input() movies: Movie[] = [];
  @Input() id = '';

  @ViewChild('carousel')
  carousel!: ElementRef<HTMLDivElement>;

  private readonly scrollMemory = inject(CarouselScrollMemory);

  private readonly scrollAmount = 500;

  readonly canScrollLeft = signal(false);
  readonly canScrollRight = signal(false);

  private lastKnownScrollLeft = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movies'] && this.carousel) {
      this.restoreScrollPosition();
    }
  }

  ngAfterViewInit(): void {
    this.restoreScrollPosition();
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
    this.lastKnownScrollLeft = this.carousel.nativeElement.scrollLeft;
    this.updateScrollButtonsState();
  }

  private restoreScrollPosition(): void {
    if (this.movies.length === 0) {
      return;
    }

    const remembered = this.id ? this.scrollMemory.get(this.id) : undefined;
    if (remembered) {
      this.setScrollLeftInstantly(remembered);
    }

    this.updateScrollButtonsState();
  }

  private setScrollLeftInstantly(value: number): void {
    const carouselElement = this.carousel.nativeElement;
    const previousScrollBehavior = carouselElement.style.scrollBehavior;
    carouselElement.style.scrollBehavior = 'auto';
    carouselElement.scrollLeft = value;
    carouselElement.style.scrollBehavior = previousScrollBehavior;
    this.lastKnownScrollLeft = value;
  }

  private updateScrollButtonsState(): void {
    const carouselElement = this.carousel.nativeElement;
    this.canScrollLeft.set(carouselElement.scrollLeft > 0);
    this.canScrollRight.set(
      carouselElement.scrollLeft + carouselElement.clientWidth < carouselElement.scrollWidth - 1,
    );
  }
}
