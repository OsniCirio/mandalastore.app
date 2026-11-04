import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { DrawerService } from '../../pages/cart-drawer/Services/drawer.service';
import { FavoritoService } from '../../services/favorito-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  menuAberto = false;

  constructor(private cartService: CartService,
    private drawerService: DrawerService,
    public favoritoService: FavoritoService) { }

  ngOnInit(): void {

   
    this.cartService.cartCount
      .subscribe(count => {

        this.cartCount = count;
      });
  }
  openCart() {

    this.drawerService.open();
  }


  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

}
