import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { Movie } from '../../../../core/models/movie';
import { Tmdb } from '../../../../core/services/tmdb';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tmdb = inject(Tmdb);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly movies = signal<Movie[]>([]);
  readonly query = signal('');
  readonly page = signal(1);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          const query = params.get('title') ?? '';
          const page = params.get('page') ? Number(params.get('page')) : 1;

          this.query.set(query);
          this.page.set(page);
          this.error.set(false);

          if (!query) {
            this.movies.set([]);
            this.totalPages.set(0);
            this.loading.set(false);
            return of(null);
          }

          this.loading.set(true);
          return this.tmdb.search(query, page).pipe(
            catchError(() => {
              this.error.set(true);
              return of(null);
            }),
          );
        }),
      )
      .subscribe((response) => {
        this.loading.set(false);
        if (response) {
          this.movies.set(response.results);
          this.totalPages.set(response.total_pages);
        }
      });
  }

  onPageChange(newPage: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });
  }
}
