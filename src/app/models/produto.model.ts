
export interface Produto {

  id?: string;

  nome: string;

  descricao: string;

  categoria: string;

  categoriaId: string;

  temaId: string;

  preco: number;

  estoque: number;

  peso: number;

  altura: number;

  largura: number;

  comprimento: number;

  ativo: boolean;

  imagemUrl?: string;
}
export interface ProdutoDetalheDto {
  id: string;
  nome: string;
  descricao: string | null ;
  preco: number;
  categoriaId: string;
  categoria: string | null;
  temaId: string;
  tema: string;
  altura: number;
  largura: number;
  imagemUrl: string;
}
