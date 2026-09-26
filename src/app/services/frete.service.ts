import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { calcularFreteDto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class FreteService {


  private api =
    `${environment.apiUrl}/frete`;

  constructor(
    private http: HttpClient
  ) { }

  calcular(cep: calcularFreteDto) {
    return this.http.post<any[]>(

      `${this.api}/calcular`,
       cep
      );
  }
}
