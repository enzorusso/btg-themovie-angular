import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Movie } from '../../../core/models/movie';

@Component({
  selector: 'app-movie-card',
  standalone: false,
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;
}
