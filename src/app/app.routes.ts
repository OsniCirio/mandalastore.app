import { Routes } from '@angular/router';
import { ProdutoDetailComponent } from './pages/product-detail/produto-detail.component'
import { CartComponent } from './pages/cart/cart.component';
import { CartDrawerComponent } from './pages/cart-drawer/cart-drawer.component'; 
import { HomeComponent } from './pages/home/home.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductFormComponent } from './admin/produtos/produto-form/produto-form.component';
import { ProdutosListComponent } from './admin/produtos/produto-list/produto-list.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { PixPaymentComponent } from './pages/pix-payment/pix-payment.component';
import { CategoriaComponent } from './admin/categoria/categoria.component';
import { CategoriaListComponent } from './admin/categoria/categoria-list.component/categoria-list.component';
import { TemasListComponent } from './admin/temas/temas-list.component';
import { TemasComponent } from './admin/temas/temas.component/temas.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { EtiquetaPedidoComponent } from './admin/etiqueta-pedido/etiqueta-pedido.component';
import { PedidoComponent } from './admin/pedido/pedido.component';
import { AcompanhamentoPedidoComponent } from './pages/acompanhamento-pedido/acompanhamento-pedido.component';
import { MateriaisComponent } from './components/materiais/materiais.component';


export const routes: Routes = [

 
  {
    path: 'produto/:id',
    component: ProdutoDetailComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'acompanhar-pedido/:id',
    component: AcompanhamentoPedidoComponent
  },
  {
    path: 'materiais',
    component: MateriaisComponent
  },
  {
    path: 'favoritos',
    component: FavoritosComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
 
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./pages/carrinho/carrinho.component')
        .then(m => m.CarrinhoComponent)
  },
  {
    path: 'cartdrawer',
    loadComponent: () =>
      import('./pages/cart-drawer/cart-drawer.component')
        .then(m => m.CartDrawerComponent)
  },
  {
    path: 'pix',
    component: PixPaymentComponent
  },
  {
    path: 'pix/:id',
    component: PixPaymentComponent
  },
 
  {
  path: 'admin',
  component: AdminLayoutComponent,
  children: [

    {
      path: 'produtos',
      component: ProdutosListComponent
    },
    {
      path: 'pedidos',
      component: PedidoComponent
    },

    {
      path: 'produtos/novo',
      component: ProductFormComponent
    },
    {
      path: 'categoria/novo',
      component: CategoriaComponent
    },
    {
      path: 'categoria/editar/:id',
      component: CategoriaComponent
    },

    {
      path: 'listacategoria',
      component: CategoriaListComponent
    },
    {
      path: 'etiquetas',
      component: EtiquetaPedidoComponent
    },
    {
      path: 'tema/novo',
      component: TemasComponent
    },
    {
      path: 'tema/editar/:id',
      component: TemasComponent
    },

    {
      path: 'listatema',
      component: TemasListComponent
    },
    {
      path: 'produtos/editar/:id',
      component: ProductFormComponent
    }

  ]
  }
];
