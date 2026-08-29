import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'tmdbImage',
  standalone: false,
})
export class TmdbImagePipe implements PipeTransform {
  transform(path: string | null | undefined, size: string): string | null {
    if (!path) {
      return null;
    }

    return `${environment.tmdbImageBaseUrl}${size}${path}`;
  }
}
