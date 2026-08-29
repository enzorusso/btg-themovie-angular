import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Movie, MovieSection } from '../../../../core/models/movie';
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
  readonly nowPlayingMovies = signal<Movie[]>([]);
  readonly topRatedMovies = signal<Movie[]>([]);

  readonly sections: MovieSection[] = [
    {
      title: 'Populares',
      movies: this.popularMovies,
    },
    {
      title: 'Melhores Avaliados',
      movies: this.topRatedMovies,
    },
  ];

  // TODO: Create with some genres

  ngOnInit(): void {
    forkJoin({
      popular: this.tmdb.getPopularMovies(),
      upcoming: this.tmdb.getUpcomingMovies(),
      topRated: this.tmdb.getTopRatedMovies(),
    }).subscribe({
      next: ({ popular, upcoming, topRated }) => {
        this.popularMovies.set(popular.results);
        this.upcomingMovies.set(upcoming.results);
        this.topRatedMovies.set(topRated.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
