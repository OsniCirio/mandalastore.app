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
  getById(id: string) {
    return this.http.get<any>(
      `${this.api}/${id}`
    );
  }
  getAll() {
    return this.http.get<any[]>(
      this.api
    );
  }
  criarEnvio(pedidoId: string) {
    return this.http.post(
      `${this.api}/${pedidoId}/etiqueta`,
      {}
    );
  }

  comprarFrete(pedidoId: string) {
    return this.http.post(
      `${this.api}/${pedidoId}/checkout-frete`,
      {}
    );
  }
  enviarEtiqueta(id: string) {

    return this.http.post(
      `${this.api}/${id}/etiqueta`,
      {}
    );
  }
  gerarEtiqueta(id: string) {

    return this.http.post(
      `${this.api}/${id}/gerar-etiqueta`,
      {}
    );
  }

  imprimirEtiqueta(pedidoId: string) {
    return this.http.post<{ mensagem: string; url: string }>(
      `${this.api}/${pedidoId}/imprimir-etiqueta`,
      {}
    );
  }
}
