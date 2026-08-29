import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Movie } from '../../../../core/models/movie';
import { Tmdb } from '../../../../core/services/tmdb';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly tmdb = inject(Tmdb);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly popularMovies = signal<Movie[]>([]);
  readonly upcomingMovies = signal<Movie[]>([]);

  ngOnInit(): void {
    forkJoin({
      popular: this.tmdb.getPopularMovies(),
      upcoming: this.tmdb.getUpcomingMovies(),
    }).subscribe({
      next: ({ popular, upcoming }) => {
        this.popularMovies.set(popular.results);
        this.upcomingMovies.set(upcoming.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
