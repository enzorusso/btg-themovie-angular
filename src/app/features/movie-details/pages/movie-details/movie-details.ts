import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CastMember } from '../../../../core/models/credits';
import { MovieDetails as MovieDetailsModel } from '../../../../core/models/movie';
import { Tmdb } from '../../../../core/services/tmdb';

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tmdb = inject(Tmdb);
  private readonly location = inject(Location);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly movie = signal<MovieDetailsModel | null>(null);
  readonly cast = signal<CastMember[]>([]);
  readonly director = signal<string | null>(null);
  readonly genres = signal<string[] | null>([]);
  readonly releaseDate = signal<string | null>(null);

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      details: this.tmdb.getMovieDetails(movieId),
      credits: this.tmdb.getMovieCredits(movieId),
    }).subscribe({
      next: ({ details, credits }) => {
        this.movie.set(details);
        this.cast.set(credits.cast.slice(0, 10));
        this.director.set(credits.crew.find((member) => member.job === 'Director')?.name ?? null);
        this.genres.set(details.genres.map((genre) => genre.name));
        this.releaseDate.set(details.release_date);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
