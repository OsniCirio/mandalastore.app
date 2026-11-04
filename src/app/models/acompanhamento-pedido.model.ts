
export interface AcompanhamentoPedido {
  nomeCliente: string;
  dataPedido: string;
  total: number;
  status: string;
  freteServico?: string | null;
}
