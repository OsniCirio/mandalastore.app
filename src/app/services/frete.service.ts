import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FreteService {

    private api =
    'https://localhost:7071/api/frete';

  constructor(
    private http: HttpClient
  ) { }

  calcular(cep: string) {

    return this.http.post<any[]>(

      `${this.api}/calcular`,

      {
        cepDestino: cep,

        peso: 0.5,

        altura: 40,

        largura: 40,

        comprimento: 5
      });
  }
}
