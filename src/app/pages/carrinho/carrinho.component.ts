import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../app.config';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule,
    RouterModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css',
})
export class CarrinhoComponent implements OnInit {
  items: CartItem[] = [];
  apiUrl = environment.uploadsUrl;
  total = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.carregar();
  }
  carregar(): void {

   
    this.total =
      this.cartService.getTotal();
  }
}
