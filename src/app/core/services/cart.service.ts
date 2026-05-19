import { Injectable } from '@angular/core';

import { CartItem }
  from '../../models/cart-item.model';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'mandala-car';

  cartCount = new BehaviorSubject<number>(0);

  getCart(): any[] {

    const cart =
      localStorage.getItem(this.storageKey);

    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart: any[]) {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(cart)
    );
  }
  updateCartCount() {

    const cart = this.getCart();

    const total = cart.reduce(

      (sum, item) =>

        sum + item.quantidade,

      0
    );

    this.cartCount.next(total);
  }
  addItem(produto: any) {

    const cart = this.getCart();

    const item =
      cart.find(x => x.id === produto.id);

    if (item) {

      item.quantidade++;

    } else {

      cart.push({

        id: produto.id,

        nome: produto.nome,

        valor: produto.preco,

        imagemUrl: produto.imagemUrl,

        categoria: produto.categoria,

        descricao: produto.descricao,

        quantidade: 1
      });
    }

    this.saveCart(cart);
    this.updateCartCount();
  }

  increase(produtoId: string) {

    const cart = this.getCart();

    const item =
      cart.find(x => x.id === produtoId);

    if (item) {

      item.quantidade++;

      this.saveCart(cart);
      this.updateCartCount();
    }
  }

  decrease(produtoId: string) {

    let cart = this.getCart();

    const item =
      cart.find(x => x.id === produtoId);

    if (!item)
      return;

    item.quantidade--;

    if (item.quantidade <= 0) {

      cart = cart.filter(
        x => x.id !== produtoId
      );
    }

    this.saveCart(cart);
    this.updateCartCount();
  }

  remove(produtoId: string) {

    const cart =
      this.getCart()
        .filter(x => x.id !== produtoId);

    this.saveCart(cart);
  }

  clear() {

    localStorage.removeItem(this.storageKey);
  }

  getTotal(): number {

    const cart = this.getCart();

    return cart.reduce(

      (total, item) =>

        total + (
          item.valor * item.quantidade
        ),

      0
    );
  }

}
