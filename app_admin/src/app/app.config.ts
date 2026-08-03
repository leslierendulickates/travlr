import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptProvider } from './utils/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // withInterceptorsFromDi() is required in Angular 17+ so the
    // class-based JwtInterceptor (HTTP_INTERCEPTORS) actually runs.
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(HttpClientModule),
    authInterceptProvider
  ]
};
