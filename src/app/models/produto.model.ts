
export interface Produto {

  id?: string;

  nome: string;

  descricao: string;

  categoria: string;

  preco: number;

  estoque: number;

  peso: number;

  altura: number;

  largura: number;

  comprimento: number;

  ativo: boolean;

  imagemUrl?: string;
}
