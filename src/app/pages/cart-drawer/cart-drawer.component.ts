import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { environment } from '../../environments/environment';
import { CartService } from '../../core/services/cart.service';
import { DrawerService } from './Services/drawer.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css',
})
export class CartDrawerComponent {
  cartItems: CartItem[] = [];
  apiUrl = environment.uploadsUrl;
  total = 0;
  frete = 0;
  totalcompra = 0;
  opened = false;

  constructor(private cartService: CartService,
    private cd: ChangeDetectorRef,
    private drawerService: DrawerService,
    private router: Router) { }

  ngOnInit(): void {
  

    this.drawerService.isOpen
      .subscribe({

        next: (value) => {

          this.opened = value;
          this.carregar();
        }
      });
  }
  carregar(): void {

    this.cartItems =
      this.cartService.getCart();


    this.total =
      this.cartService.getTotal();
  }

  Qtde(id: string, qtde: number): void {

    if (qtde === 1)
      this.cartService.increase(id);
    else
      this.cartService.decrease(id);

    this.total =
      this.cartService.getTotal();
    this.totalcompra = this.total + this.frete;
    this.carregar();

    this.cd.detectChanges();
  }
  finaliza() {
  
    this.close();
    this.router.navigate(['/checkout']);
  }
  close() {
    this.drawerService.close();
    this.opened = false;
  }
  toggle() {

    this.opened = !this.opened;
  }
}
