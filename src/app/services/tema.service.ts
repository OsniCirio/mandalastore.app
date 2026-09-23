import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../app.config';
import { TemaModel } from '../models/tema.model';


@Injectable({
  providedIn: 'root',
})

export class TemaService {
  private api =
    `${environment.apiUrl}/Tema`;

  constructor(
    private http: HttpClient
  ) { }

  listar(): Observable<any> {
    return this.http.get<any>(
      `${this.api}/getall`);
  }
  listaTemaProduto(): Observable<any> {
    return this.http.get<any>(
      `${this.api}/temaProduto`);
  }
  getById(
    id: string
  ): Observable<TemaModel> {

    return this.http.get<TemaModel>(
      `${this.api}/${id}`
    );
  }
  getByName(
    name: string
  ): Observable<TemaModel> {

    return this.http.get<TemaModel>(
      `${this.api}/nome${name}`
    );
  }

  create(
    formData: FormData
  ) {

    return this.http.post(
      this.api,
      formData
    );
  }
  update(
    id: string,
    formData: FormData
  ) {

    return this.http.put(
      `${this.api}/${id}`,
      formData
    );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.api}/${id}`
    );
  }
}
