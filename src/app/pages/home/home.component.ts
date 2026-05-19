import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { environment } from '../../app.config';
import { CommonModule } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [CommonModule,
    RouterModule],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  produtos: any[] = [];
  loading = false;
  uploadsUrl = environment.uploadsUrl;
  produtoAdicionado: string | null = null;

  ngOnInit(): void {

    this.carregarDestaques();
  }
    constructor(private produtoService: ProdutoService,
    private cd: ChangeDetectorRef,
    private cartService: CartService,
      private toastr: ToastrService,
      private router: Router
  )
  {
  }

  carregarDestaques(): void {

    this.loading = true;
    
    this.produtoService
      .listarDestaques()
      .subscribe({

        next: (res) => {

          this.produtos = res;

          this.loading = false;
          this.cd.detectChanges();
        },

        error: () => {

          this.loading = false;
        }
      });
  }
 abrirproduto(item: any) {

    this.router.navigate([
      '/produto',
      item.id
    ]);
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
  
}
