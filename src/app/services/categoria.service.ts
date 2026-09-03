import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../app.config';
import { CategoriaModel } from '../models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private api =
    `${environment.apiUrl}/categoria`;

  constructor(
    private http: HttpClient
  ) { }

  listar(): Observable<any> {
    return this.http.get<any>(
      `${this.api}/getall`);
  }
  listaCategoriaProduto(): Observable<any> {
    return this.http.get<any>(
      `${this.api}/CategoriaProduto`);
  }
  getById(
    id: string
  ): Observable<CategoriaModel> {

    return this.http.get<CategoriaModel>(
      `${this.api}/${id}`
    );
  }
  getByName(
    name: string
  ): Observable<CategoriaModel> {

    return this.http.get<CategoriaModel>(
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
