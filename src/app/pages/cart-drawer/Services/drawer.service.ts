import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  isOpen =
    new BehaviorSubject<boolean>(false);

  open() {

    this.isOpen.next(true);
  }

  close() {

    this.isOpen.next(false);
  }

  toggle(current: boolean) {

    this.isOpen.next(!current);
  }
}
