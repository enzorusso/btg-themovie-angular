import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
export class MoviesCarousel implements OnChanges, AfterViewInit {
  @Input() movies: Movie[] = [];

  @ViewChild('carousel')
  carousel!: ElementRef<HTMLDivElement>;

  private readonly scrollAmount = 500;

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
  }

  private centerScroll(): void {
    if (this.movies.length === 0) {
      return;
    }

    this.setScrollLeftInstantly(this.copyWidth);
  }

  private setScrollLeftInstantly(value: number): void {
    const carouselElement = this.carousel.nativeElement;
    const previousScrollBehavior = carouselElement.style.scrollBehavior;
    carouselElement.style.scrollBehavior = 'auto';
    carouselElement.scrollLeft = value;
    carouselElement.style.scrollBehavior = previousScrollBehavior;
  }
}
