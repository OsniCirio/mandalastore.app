import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import {
  provideHttpClient,
  withFetch,
  withInterceptors
} from '@angular/common/http';

import {
  provideAnimations
} from '@angular/platform-browser/animations';

import {
  provideToastr
} from 'ngx-toastr';

import { routes } from './app.routes';

import { apiInterceptor }
  from './core/interceptors/api-interceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },

    provideBrowserGlobalErrorListeners(),

    provideHttpClient(

      withFetch(),

      withInterceptors([
        apiInterceptor
      ])
    ),

    provideRouter(routes),

    provideClientHydration(
      withEventReplay()
    ),

    provideAnimations(),

    provideToastr({

      positionClass:
        'toast-bottom-right',

      timeOut: 3000,

      preventDuplicates: true

    })
  ]
};
