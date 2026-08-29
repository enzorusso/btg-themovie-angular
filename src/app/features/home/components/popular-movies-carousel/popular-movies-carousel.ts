import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Movie } from '../../../../core/models/movie';

@Component({
  selector: 'app-popular-movies-carousel',
  standalone: false,
  templateUrl: './popular-movies-carousel.html',
  styleUrl: './popular-movies-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopularMoviesCarousel {
  @Input() movies: Movie[] = [];

  @ViewChild('carousel')
  carousel!: ElementRef<HTMLDivElement>;

  private readonly scrollAmount = 500;

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
}
