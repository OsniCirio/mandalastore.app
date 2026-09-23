import { CartItem } from "./cart-item.model";

export interface Pedido {

  id: string;

  nomeCliente: string;

  telefone: string;

  documento: string;

  email: string;

  endereco: string;

  itens: CartItem[];

  total: number;

  freteServicoId?: number;
  freteServico?: string;
  freteTransportadora?: string;
  fretePrazo?: number;

  melhorEnvioId?: string;
  etiquetaUrl?: string;
  etiquetaGeradaEm?: Date;

  paymentId?: number;

  dataPedido?: Date;

  status?: string;
}
export interface calcularFreteDto
{
  cepDestino?: string;

  produtos: produtoFreteDto[];
}

export interface produtoFreteDto {
  id: string;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  valor: number;
  quantidade: number;
}
