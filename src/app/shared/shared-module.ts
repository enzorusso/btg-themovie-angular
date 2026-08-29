import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovieCard } from './components/movie-card/movie-card';
import { Pagination } from './components/pagination/pagination';
import { SearchBar } from './components/search-bar/search-bar';
import { Skeleton } from './components/skeleton/skeleton';
import { MaterialModule } from './material/material-module';
import { TmdbImagePipe } from './pipes/tmdb-image-pipe';

@NgModule({
  declarations: [TmdbImagePipe, MovieCard, SearchBar, Skeleton, Pagination],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    TmdbImagePipe,
    MovieCard,
    SearchBar,
    Skeleton,
    Pagination,
  ],
})
export class SharedModule {}
