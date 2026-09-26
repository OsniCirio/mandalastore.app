import { AfterViewInit, ChangeDetectorRef, Component, signal } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoDetalheDto } from '../../models/produto.model';
import { environment } from '../../environments/environment';
import {
  NgxMaskDirective,
  NgxMaskPipe,
  provideEnvironmentNgxMask,
  provideNgxMask
} from 'ngx-mask';
import { CommonModule, Location } from '@angular/common';
import { Console } from 'console';
import { stringify } from 'querystring';
import { Init } from 'v8';
import { CartService } from '../../core/services/cart.service';
import { FavoritoService } from '../../services/favorito-service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule], 
  templateUrl: './produto-detail.component.html',
  styleUrl: './produto-detail.component.css',
})
export class ProdutoDetailComponent implements  AfterViewInit {
  
 

  productId: string | null = null;
  produtoDetalhe = signal<ProdutoDetalheDto | null>(null);
  previewImage: string | null = null;
  produtoAdicionado: string | null = null;

  constructor(
    private productService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private cartService: CartService,
    private location: Location,
    private favoritoService: FavoritoService
   ) { }
  ngAfterViewInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    this.loadProduto();
   }

  loadProduto() {
    if (this.productId) {
      this.productService.getProdutoById(this.productId).subscribe(
        (produto: ProdutoDetalheDto) => {
          this.produtoDetalhe.set(produto);
         
          this.previewImage = `${environment.uploadsUrl}${produto.imagemUrl ?? null}`;
    
        },
        (error) => {
          console.error('Erro ao carregar o produto:', error);
        }
      );
    }
   
  }
  getImageUrl(
   
  ): string {

    if (!this.previewImage) {

      return 'assets/images/no-image.jpg';
    }

    return this.previewImage; 
  }
  adicionarCarrinho(item: any): void {


    this.cartService.addItem(item);

    this.produtoAdicionado =
      item.id;

    setTimeout(() => {

      this.produtoAdicionado = null;
      this.cd.detectChanges();

    }, 2000);
  }
  voltar(): void {
    this.location.back();
  }
  adicionarFavorito(item: any): void {
    this.favoritoService.alternar(item.id);
  }
}


