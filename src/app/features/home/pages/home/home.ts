import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, forkJoin } from 'rxjs';
import { Movie, MovieSection } from '../../../../core/models/movie';
import { Tmdb } from '../../../../core/services/tmdb';
import { restoreScrollPositionWhenReady } from '../../../../shared/utils/scroll-restoration';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly tmdb = inject(Tmdb);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private pendingScrollPosition: [number, number] | null = null;

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly popularMovies = signal<Movie[]>([]);
  readonly upcomingMovies = signal<Movie[]>([]);
  readonly nowPlayingMovies = signal<Movie[]>([]);
  readonly topRatedMovies = signal<Movie[]>([]);
  readonly actionMovies = signal<Movie[]>([]);
  readonly comedyMovies = signal<Movie[]>([]);

  readonly sections: MovieSection[] = [
    {
      title: 'Populares',
      movies: this.popularMovies,
    },
    {
      title: 'Melhores Avaliados',
      movies: this.topRatedMovies,
    },
    {
      title: 'Ação',
      movies: this.actionMovies,
    },
    {
      title: 'Comédia',
      movies: this.comedyMovies,
    },
  ];

  constructor() {
    this.router.events
      .pipe(filter((event): event is Scroll => event instanceof Scroll))
      .subscribe((event) => {
        this.pendingScrollPosition = event.position;
      });
  }

  ngOnInit(): void {
    forkJoin({
      popular: this.tmdb.getPopularMovies(),
      upcoming: this.tmdb.getUpcomingMovies(),
      topRated: this.tmdb.getTopRatedMovies(),
      action: this.tmdb.getMoviesByGenre(28),
      comedy: this.tmdb.getMoviesByGenre(35),
    }).subscribe({
      next: ({ popular, upcoming, topRated, action, comedy }) => {
        this.popularMovies.set(popular.results);
        this.upcomingMovies.set(upcoming.results);
        this.topRatedMovies.set(topRated.results);
        this.actionMovies.set(action.results);
        this.comedyMovies.set(comedy.results);

        this.loading.set(false);
        if (this.pendingScrollPosition) {
          restoreScrollPositionWhenReady(this.pendingScrollPosition, this.viewportScroller);
        }
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
