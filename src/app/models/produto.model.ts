
export interface Produto {

  id?: string;

  nome: string;

  descricao: string;

  categoria: string;

  preco: number;

  estoque: number;

  peso: number;

  ativo: boolean;

  imagemUrl?: string;
}
