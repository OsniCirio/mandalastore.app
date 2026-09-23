export interface CartItem {

  id: string;

  produtoId: string;   // ID real do Produto

  nome: string;

  categoria: string;

  valor: number;

  largura: number;

  altura: number;

  peso: number;

  descricao: string;

  imagemUrl: string;

  quantidade: number;
}
