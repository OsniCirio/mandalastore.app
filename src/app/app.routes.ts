import { Routes } from '@angular/router';
import { ProdutoDetailComponent } from './pages/product-detail/produto-detail.component'
import { CartComponent } from './pages/cart/cart.component';
import { CartDrawerComponent } from './pages/cart-drawer/cart-drawer.component'; 
import { HomeComponent } from './pages/home/home.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductFormComponent } from './admin/produtos/produto-form/produto-form.component';
import { ProdutosListComponent } from './admin/produtos/produto-list/produto-list.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';

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
  path: 'admin',
  component: AdminLayoutComponent,
  children: [

    {
      path: 'produtos',
      component: ProdutosListComponent
    },

    {
      path: 'produtos/novo',
      component: ProductFormComponent
    },

    {
      path: 'produtos/editar/:id',
      component: ProductFormComponent
    }

  ]
  }
];
