import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CartService } from '../../core/services/cart.service';

import { PedidoService } from '../../services/pedido.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';

@Component({

  selector: 'app-checkout',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],

  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {

  form!: FormGroup;

  cartItems: any[] = [];

  total = 0;

  loading = false;

  constructor(

    private fb: FormBuilder,

    private cartService: CartService,

    private pedidoService: PedidoService,
    private toastr: ToastrService,
    private router: Router

  ) { }

  ngOnInit(): void {

    this.cartItems =
      this.cartService.getCart();

    this.total =
      this.cartService.getTotal();

    this.form = this.fb.group({

      nomeCliente: [
        '',
        Validators.required
      ],

      telefone: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      endereco: [
        '',
        Validators.required
      ]
    });
  }

  finalizar() {

    if (this.form.invalid)
      return;
    debugger;
    this.loading = true;

    const pedido = {

      ...this.form.value,

      itens: this.cartItems,

      total: this.total,

      dataPedido: new Date(),

      status: 'Pendente'
    };

    this.pedidoService
      .criar(pedido)
      .subscribe({

        next: () => {

          this.loading = false;

          this.cartService.clear();

          this.toastr.success('Pedido realizado!');

          this.router.navigate(['/pix']);
        },

        error: () => {

          this.loading = false;
        }
      });
  }
}

