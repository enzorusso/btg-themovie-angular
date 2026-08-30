import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Movie } from '../../../../core/models/movie';

const AUTOPLAY_INTERVAL_MS = 5000;

@Component({
  selector: 'app-banner-carousel',
  standalone: false,
  templateUrl: './banner-carousel.html',
  styleUrl: './banner-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerCarousel implements OnChanges, OnDestroy {
  @Input() movies: Movie[] = [];

  readonly currentIndex = signal(0);

  private intervalId?: ReturnType<typeof setInterval>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movies']) {
      this.currentIndex.set(0);
      this.restartAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.restartAutoplay();
  }

  pauseAutoplay(): void {
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.restartAutoplay();
  }

  private restartAutoplay(): void {
    this.stopAutoplay();

    if (this.movies.length <= 1) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.movies.length);
    }, AUTOPLAY_INTERVAL_MS);
  }

  private stopAutoplay(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
