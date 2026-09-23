import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  Signal,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  EMPTY,
  catchError,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../core/services/cart.service';
import { FreteResponse } from '../../models/dto/response/frete-response.dto';
import {
  CepService,
  EnderecoViaCep
} from '../../services/cep.service';
import { FreteService } from '../../services/frete.service';
import { PedidoService } from '../../services/pedido.service';
import { calcularFreteDto } from '../../models/pedido.model';

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
export class CheckoutComponent implements OnInit {

  form!: FormGroup;

  cartItems: any[] = [];

  subtotal = 0;

  total = 0;
  

  loading = false;

  _calculando : calcularFreteDto = {
    cepDestino: '',
    produtos: []
  };

  buscandoCep = false;

  enderecoLocalizado = false;

  erroCep = '';

  calculandoFrete = false;

  erroFrete = '';

  fretes: FreteResponse[] = [];

  freteSelecionado?: FreteResponse;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly pedidoService: PedidoService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly freteService: FreteService,
    private readonly cepService: CepService,
    private cd: ChangeDetectorRef,
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
      documento: ['', Validators.required],
      cep: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{5}-?\d{3}$/)
        ]
      ],
      logradouro: [
        '',
        Validators.required
      ],
      numero: [
        '',
        Validators.required
      ],
      complemento: [''],
      bairro: [
        '',
        Validators.required
      ],
      cidade: [
        '',
        Validators.required
      ],
      estado: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2)
        ]
      ]
    });

    this.configurarConsultaAutomaticaCep();
  }

  selecionarFrete(frete: FreteResponse): void {

    this.freteSelecionado = frete;

    this.total =
      this.subtotal + Number(frete.valor);
  }

  finalizar(): void {

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.warning(
        'Preencha corretamente os dados pessoais e o endereço.'
      );
      return;
    }

    if (!this.freteSelecionado) {
      this.toastr.warning(
        'Selecione uma opção de entrega.'
      );
      return;
    }

    if (this.cartItems.length === 0) {
      this.toastr.warning(
        'O carrinho está vazio.'
      );
      return;
    }

    this.loading = true;

    const dados = this.form.getRawValue();

    const enderecoEntrega = {
      cep: this.somenteNumeros(dados.cep),
      logradouro: String(dados.logradouro).trim(),
      numero: String(dados.numero).trim(),
      complemento: String(dados.complemento ?? '').trim(),
      bairro: String(dados.bairro).trim(),
      cidade: String(dados.cidade).trim(),
      estado: String(dados.estado).trim().toUpperCase(),
      documento: String(dados.documento?.replace(/\D/g, '')),
    };
    debugger;
    const pedido = {
      cep: this.somenteNumeros(dados.cep),
      nomeCliente: String(dados.nomeCliente).trim(),
      telefone: String(dados.telefone).trim(),
      email: String(dados.email).trim(),
      documento: String(dados.documento?.replace(/\D/g, '')),
      bairro: String(dados.bairro).trim(),
      cidade: String(dados.cidade).trim(),
      numero: String(dados.numero).trim(),
      uf: String(dados.estado).trim().toUpperCase(),
      complemento: String(dados.complemento ?? '').trim(),
      endereco: String(dados.logradouro).trim(),
      // Mantido para compatibilidade com o backend atual.
      
      // Estrutura que deverá ser incorporada ao DTO do backend.
      freteServicoId: this.freteSelecionado?.id,
      freteServico: this.freteSelecionado?.servico,
      freteTransportadora: this.freteSelecionado?.transportadora,
      fretePrazo: this.freteSelecionado?.prazoDias,

      itens: this.cartItems,
      subtotal: this.subtotal,
      valorFrete: Number(this.freteSelecionado.valor),
      servicoFrete: this.freteSelecionado.servico,
      prazoEntrega: this.freteSelecionado.prazoDias,

      total: this.total,
      dataPedido: new Date(),
      status: 'Pendente'
    };

    this.pedidoService
      .criar(pedido)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (pedidoCriado: any) => {
          this.loading = false;
          this.cartService.clear();
          this.toastr.success('Pedido realizado!');

          this.router.navigate([
            '/pix',
            pedidoCriado.id
          ]);

          //this.router.navigate([
          //  '/pedido-sucesso',
          //  pedidoCriado.id
          //]);
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            'Não foi possível finalizar o pedido.'
          );
        }
      });
  }

  private configurarConsultaAutomaticaCep(): void {

    const cepControl = this.form.get('cep');

    if (!cepControl)
      return;

    cepControl.valueChanges
      .pipe(
        map(valor =>
          this.somenteNumeros(valor ?? '')
        ),
        distinctUntilChanged(),
        tap(() => {
          this.buscandoCep = false;
          this.enderecoLocalizado = false;
          this.erroCep = '';
          this.limparEndereco();
          this.resetarFrete();
        }),
        switchMap(cep => {

          if (cep.length !== 8)
            return EMPTY;

          this.buscandoCep = true;

          return this.cepService
            .buscar(cep)
            .pipe(
              map(endereco => ({
                endereco,
                falhaNaConsulta: false
              })),
              catchError(() =>
                of({
                  endereco: null,
                  falhaNaConsulta: true
                })
              )
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(resultado => {

        this.buscandoCep = false;

        if (resultado.falhaNaConsulta) {
          this.erroCep =
            'Não foi possível consultar o CEP. Tente novamente.';
          return;
        }

        if (
          !resultado.endereco ||
          resultado.endereco.erro
        ) {
          this.marcarCepComoNaoEncontrado();
          return;
        }

        this.preencherEndereco(resultado.endereco);
        this.cd.detectChanges();
        

      });
  }

  private preencherEndereco(
    endereco: EnderecoViaCep
  ): void {

    this.form.patchValue(
      {
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        cidade: endereco.localidade,
        estado: endereco.uf
      },
      {
        emitEvent: false
      }
    );
   

    this.enderecoLocalizado = true;

    const cep = this.somenteNumeros(
      endereco.cep
    );

    this.calcularFrete(cep);

    
  }

  private marcarCepComoNaoEncontrado(): void {

    this.erroCep = 'CEP não encontrado.';

    const cepControl = this.form.get('cep');

    cepControl?.setErrors({
      ...(cepControl.errors ?? {}),
      cepNaoEncontrado: true
    });
  }

  private calcularFrete(cep: string): void {

    this.calculandoFrete = true;
    this.erroFrete = '';


    this._calculando.cepDestino = cep;
    debugger;
    this._calculando.produtos = [];
    this.cartItems.forEach(item => {
      this._calculando.produtos.push({ id: item.id,peso: item.peso, altura: item.altura, largura: item.largura, comprimento: item.comprimento, valor: item.preco, quantidade: item.quantidade });
    });


    this.freteService
      .calcular(this._calculando)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: response => {

          
          if (this.cepAtual() !== cep)
            return;

       
          this.calculandoFrete = false;
          this.fretes = response ?? [];

          if (this.fretes.length === 0) {
            this.erroFrete =
              'Nenhuma opção de entrega foi encontrada para este CEP.';
          }
        },
        error: () => {
         
          if (this.cepAtual() !== cep)
            return;

          this.calculandoFrete = false;
          this.erroFrete =
            'Não foi possível calcular o frete.';
        }
      });
  }

  private limparEndereco(): void {

    this.form.patchValue(
      {
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''
      },
      {
        emitEvent: false
      }
    );
  }

  private resetarFrete(): void {

    this.fretes = [];
    this.freteSelecionado = undefined;
    this.calculandoFrete = false;
    this.erroFrete = '';
    this.total = this.subtotal;
  }

  private cepAtual(): string {

    return this.somenteNumeros(
      this.form.get('cep')?.value ?? ''
    );
  }

  private somenteNumeros(valor: unknown): string {

    return String(valor ?? '')
      .replace(/\D/g, '');
  }

  private montarEnderecoCompleto(
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      estado: string;
    }
  ): string {

    const logradouroNumero =
      `${endereco.logradouro}, ${endereco.numero}`;

    const partes = [
      logradouroNumero,
      endereco.complemento,
      endereco.bairro,
      `${endereco.cidade}/${endereco.estado}`,
      `CEP ${endereco.cep}`
    ];
    
    return partes
      .filter(parte => parte?.trim())
      .join(' - ');
  }
}
