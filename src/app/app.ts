import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { CartDrawerComponent } from './pages/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    NavbarComponent,
    CartDrawerComponent
  ],

  templateUrl: './app.html'
})
export class AppComponent { }
