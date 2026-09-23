import { Component, OnInit, computed, signal } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { FavoritoService } from '../../services/favorito-service';
import { Produto } from '../../models/produto.model';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../app.config';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {

  produtos = signal<Produto[]>([]);
  uploadsUrl = environment.uploadsUrl;

  favoritos = computed(() => {

    const idsFavoritos =
      this.favoritoService.favoritos();

    return this.produtos()
      .filter(produto =>
        idsFavoritos.includes(produto.id ?? '')
      );
  });

  constructor(
    private produtoService: ProdutoService,
    public favoritoService: FavoritoService
  ) { }

  ngOnInit(): void {
 
    this.carregarProdutos();
  }

  carregarProdutos(): void {

    this.produtoService.listar().subscribe({
      next: produtos => {
        this.produtos.set(produtos);
      }
    });
  }
}
