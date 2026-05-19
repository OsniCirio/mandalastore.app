import { CartItem } from "./cart-item.model";

export interface Pedido {

  id?: string;

  nomeCliente: string;

  telefone: string;

  email: string;

  endereco: string;

  itens: CartItem[];

  total: number;

  dataPedido?: Date;

  status?: string;
}
