import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SharedModule } from './shared/shared-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  /**
   * Drives the top search bar. Cleared only when navigating to the home page
   * — on any other route (e.g. movie details) the current value is left
   * untouched, so opening a movie doesn't wipe out what was searched.
   */
  readonly searchQuery = signal('');

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.syncSearchQuery(event.urlAfterRedirects));
  }

  private syncSearchQuery(url: string): void {
    const [path, queryString] = url.split('?');

    if (path === '/') {
      this.searchQuery.set('');
      return;
    }

    if (path === '/search') {
      this.searchQuery.set(new URLSearchParams(queryString ?? '').get('title') ?? '');
    }
  }
}
