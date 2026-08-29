import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { MovieDetailsRoutingModule } from './movie-details-routing-module';
import { CastList } from './components/cast-list/cast-list';
import { MovieDetails } from './pages/movie-details/movie-details';

@NgModule({
  declarations: [CastList, MovieDetails],
  imports: [CommonModule, SharedModule, MovieDetailsRoutingModule],
})
export class MovieDetailsModule {}
