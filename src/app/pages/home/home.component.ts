import {
  ChangeDetectorRef, Component, OnInit,
  afterNextRender,
  ChangeDetectionStrategy,
  computed,
  DestroyRef,
  effect,
  inject,
  signal
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { MateriaisComponent }
  from '../../components/materiais/materiais.component';
import { FaixaMensagensComponent } from '../../components/faixa-mensagens/faixa-mensagens.component';



@Component({
  selector: 'app-home',
  imports: [CommonModule,
    RouterModule, MateriaisComponent, FaixaMensagensComponent],

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
