import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const tmdbApiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.tmdbBaseUrl)) {
    return next(req);
  }

  const authorizedReq = req.clone({
    setParams: { api_key: environment.tmdbApiKey },
  });

  return next(authorizedReq);
};
