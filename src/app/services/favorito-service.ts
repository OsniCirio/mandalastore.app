import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  private readonly STORAGE_KEY = 'mandalastore_favoritos';

  private readonly _favoritos = signal<string[]>(
    this.carregar()
  );

  readonly favoritos = this._favoritos.asReadonly();

  private carregar(): string[] {
    const dados = localStorage.getItem(this.STORAGE_KEY);

    return dados
      ? JSON.parse(dados)
      : [];
  }

  alternar(produtoId: string): void {

    const favoritos = this._favoritos();

    const novosFavoritos =
      favoritos.includes(produtoId)
        ? favoritos.filter(id => id !== produtoId)
        : [...favoritos, produtoId];

    this._favoritos.set(novosFavoritos);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(novosFavoritos)
    );
  }

  ehFavorito(produtoId: string): boolean {
    return this._favoritos().includes(produtoId);
  }

  remover(produtoId: string): void {
    const favoritos =
      this._favoritos()
        .filter(id => id !== produtoId);

    this._favoritos.set(favoritos);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(favoritos)
    );
  }

  limpar(): void {
    this._favoritos.set([]);

    localStorage.removeItem(this.STORAGE_KEY);
  }
}
