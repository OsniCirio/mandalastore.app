import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { calcularFreteDto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class FreteService {

    private api =
    'https://localhost:7071/api/frete';

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
