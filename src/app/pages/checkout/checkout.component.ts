import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CartService } from '../../core/services/cart.service';

import { PedidoService } from '../../services/pedido.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { FreteResponse } from '../../models/dto/response/frete-response.dto';
import { FreteService } from '../../services/frete.service';

@Component({

  selector: 'app-checkout',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],

  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {

  form!: FormGroup;

  cartItems: any[] = [];

  total = 0;

  loading = false;

  cep = '';

  fretes: FreteResponse[] = [];

  freteSelecionado?: FreteResponse;

  subtotal = 0;
  

  constructor(

    private fb: FormBuilder,

    private cartService: CartService,

    private pedidoService: PedidoService,
    private toastr: ToastrService,
    private router: Router,
    private freteService: FreteService

  ) { }

  ngOnInit(): void {


    this.cartItems = this.cartService.getCart();

    this.subtotal = this.cartService.getTotal();

    this.total = this.subtotal;

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
  calcularFrete() {
    debugger;
    if (!this.cep)
      return;
      
    this.freteService
      .calcular(this.cep)

      .subscribe({

        next: (response) => {

          this.fretes = response;
        }
      });
  }
  
  selecionarFrete(frete: any) {
    this.freteSelecionado = frete;

    this.total =
      this.subtotal + frete.valor;
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

