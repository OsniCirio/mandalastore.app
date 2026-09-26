import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { environment } from '../../environments/environment';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  apiUrl = environment.uploadsUrl;
  total = 0;
  frete = 0;
  totalcompra = 0;

  constructor(private cartService: CartService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.carregar();
  }
  carregar(): void {

    this.items =
      this.cartService.getCart();


    this.total =
      this.cartService.getTotal();
  }
  Qtde(id: string, qtde: number): void {

    debugger;
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

  
}
