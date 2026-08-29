import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home-module').then((m) => m.HomeModule),
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('./features/movie-details/movie-details-module').then((m) => m.MovieDetailsModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search-module').then((m) => m.SearchModule),
  },
  { path: '**', redirectTo: '' },
];
