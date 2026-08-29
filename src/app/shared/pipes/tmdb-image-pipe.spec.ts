import { environment } from '../../../environments/environment';
import { TmdbImagePipe } from './tmdb-image-pipe';

describe('TmdbImagePipe', () => {
  const pipe = new TmdbImagePipe();

  it('builds the full TMDB image URL for a given size', () => {
    expect(pipe.transform('/poster.jpg', 'w342')).toBe(
      `${environment.tmdbImageBaseUrl}w342/poster.jpg`,
    );
  });

  it('returns null when there is no image path', () => {
    expect(pipe.transform(null, 'w342')).toBeNull();
  });
});
