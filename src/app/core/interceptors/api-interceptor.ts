import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import Swal from 'sweetalert2';

export const apiInterceptor: HttpInterceptorFn =
  (req, next) => {

    return next(req).pipe(

      tap((event: any) => {

        // sucesso
        if (event?.body?.success === true) {

          if (event.body.message) {

            Swal.fire({
              icon: 'success',
              title: event.body.message,
              timer: 2000,
              showConfirmButton: false
            });
          }
        }
      }),

      catchError((error: HttpErrorResponse) => {

        let message = 'Erro inesperado';

        // backend
        if (error.error?.message) {
          message = error.error.message;
        }

        // validação
        else if (error.status === 400) {
          message = 'Dados inválidos';
        }

        // auth
        else if (error.status === 401) {
          message = 'Não autorizado';
        }

        // servidor
        else if (error.status === 500) {
          message = 'Erro interno servidor';
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: message
        });

        return throwError(() => error);
      })
    );
  };
