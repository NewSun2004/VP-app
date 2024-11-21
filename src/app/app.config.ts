import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({
      onSameUrlNavigation : 'reload'
    }), withComponentInputBinding(), withInMemoryScrolling({
      scrollPositionRestoration : 'enabled'
    })),
    provideHttpClient(),
    {provide : IMAGE_CONFIG, useValue : { disableImageSizeWarning : true, disableImageLazyLoadingWaring : true }}
  ]
};
