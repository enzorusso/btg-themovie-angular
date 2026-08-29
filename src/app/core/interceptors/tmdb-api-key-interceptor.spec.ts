import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tmdbApiKeyInterceptor } from './tmdb-api-key-interceptor';

describe('tmdbApiKeyInterceptor', () => {
  function runInterceptor(url: string, next: HttpHandlerFn) {
    const req = new HttpRequest('GET', url);
    return TestBed.runInInjectionContext(() => tmdbApiKeyInterceptor(req, next));
  }

  it('adds the api_key query param for TMDB requests', () => {
    let capturedRequest!: HttpRequest<unknown>;
    const next: HttpHandlerFn = (outgoingReq) => {
      capturedRequest = outgoingReq;
      return of();
    };

    runInterceptor(`${environment.tmdbBaseUrl}/movie/popular`, next);

    expect(capturedRequest.params.get('api_key')).toBe(environment.tmdbApiKey);
  });

  it('leaves non-TMDB requests untouched', () => {
    let capturedRequest!: HttpRequest<unknown>;
    const next: HttpHandlerFn = (outgoingReq) => {
      capturedRequest = outgoingReq;
      return of();
    };

    runInterceptor('https://example.com/other', next);

    expect(capturedRequest.params.has('api_key')).toBe(false);
  });
});
