// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter }    from '@angular/router';
import { HttpClientModule } from '@angular/common/http';    // <-- importar esto
import { routes }           from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),                // <-- registrar aquí
  ]
};
