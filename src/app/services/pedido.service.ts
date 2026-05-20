import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {

  api =
    'https://localhost:7071/api/pedido';

  constructor(
    private http: HttpClient
  ) { }

  criar(pedido: any) {

    return this.http.post(
      this.api,
      pedido
    );
  }
}
