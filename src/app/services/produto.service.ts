import { HttpClient }
  from '@angular/common/http';

import { Injectable }
  from '@angular/core';

import { Observable }
  from 'rxjs';

import { Produto } from '../models/produto.model';
import { environment } from '../app.config';




@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private api =
    `${environment.apiUrl}/produto`;

  constructor(
    private http: HttpClient
  ) { }

  listar(): Observable<any> {
    return this.http.get<any>(
     `${this.api}/getall`);
  }
  getById(
    id: string
  ): Observable<Produto> {

    return this.http.get<Produto>(
      `${this.api}/${id}`
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
  listarDestaques() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/produto/destaques`
    );
  }

  uploadImage(
    id: string,
    file: File
  ): Observable<any> {

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post(
      `${this.api}/${id}/upload`,
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

