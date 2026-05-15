import { Injectable } from '@angular/core';

import { CartItem }
  from '../../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'cart';

  getItems(): CartItem[] {

    return JSON.parse(
      localStorage.getItem(this.storageKey) || '[]'
    );
  }

  add(item: CartItem): void {

    const items = this.getItems();

    const existing =
      items.find(x => x.id === item.id);

    if (existing) {

      existing.quantidade++;
    }
    else {

      items.push({
        ...item,
        quantidade: 1
      });
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(items)
    );
  }

  remove(id: string): void {

    const items =
      this.getItems()
        .filter(x => x.id !== id);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(items)
    );
  }

  clear(): void {

    localStorage.removeItem(
      this.storageKey
    );
  }

  getTotal(): number {

    return this.getItems()
      .reduce((total, item) => {

        return total +
          (item.valor * item.quantidade);

      }, 0);
  }
}
