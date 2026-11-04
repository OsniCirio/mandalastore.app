import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe,CommonModule } from '@angular/common';  
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido.component',
  imports: [CommonModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css',
})
export class PedidoComponent implements OnInit {

  pedidos: any[] = [];

  carregando = false;

  constructor(private pedidoService: PedidoService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {

    this.carregando = true;

    this.pedidoService
      .getAll()
      .subscribe({

        next: (response) => {

          this.pedidos = response;
          this.carregando = false;
          this.cd.detectChanges();
        },

        error: () => {
          this.carregando = false;

          this.toastr.error(
            'Erro ao carregar pedidos.'
          );
        }
      });
  }
  gerarEtiqueta(pedido: any) {

    if (!pedido?.id) {
      this.toastr.error(
        'Pedido inválido.'
      );
      return;
    }

    this.carregando = true;

    this.pedidoService
      .enviarEtiqueta(pedido.id)
      .subscribe({

        next: (response: any) => {

          this.carregando = false;

          console.log(
            'Retorno Melhor Envio:',
            response
          );

          this.toastr.success(
            'Envio criado no Melhor Envio.'
          );

        },

        error: (error) => {

          this.carregando = false;

          console.error(
            'Erro Melhor Envio:',
            error
          );

          this.toastr.error(
            error?.error?.mensagem ??
            'Erro ao criar envio.'
          );
        }
      });


  }

 imprimirEtiqueta(pedido: any): void {

    if (!pedido.etiquetaUrl)
      return;

    window.open(
      pedido.etiquetaUrl,
      '_blank',
      'noopener,noreferrer'
    );
  }

  
}
