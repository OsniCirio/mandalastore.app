import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {

  private readonly http =
    inject(HttpClient);

  buscar(cep: string): Observable<EnderecoViaCep> {

    const cepSomenteNumeros =
      cep.replace(/\D/g, '');

    return this.http.get<EnderecoViaCep>(
      `https://viacep.com.br/ws/${cepSomenteNumeros}/json/`
    );
  }
}
