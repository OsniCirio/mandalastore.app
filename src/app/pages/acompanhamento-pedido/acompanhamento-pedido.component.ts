import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';


@Component({
  selector: 'app-acompanhamento-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acompanhamento-pedido.component.html',
  styleUrl: './acompanhamento-pedido.component.css'
})
export class AcompanhamentoPedidoComponent implements OnInit {

  pedido?: Pedido;
  pedidoId!: string;
  carregando = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.pedidoId =
      this.route.snapshot.paramMap.get('pedidoId')!;

    this.carregarPedido();
  }

  carregarPedido(): void {

    this.carregando = true;

    this.pedidoService.getById(this.pedidoId)
      .subscribe({

        next: (pedido: Pedido) => {
          this.pedido = pedido;
          this.carregando = false;
        },

        error: (error) => {
          console.error(
            'Erro ao carregar pedido:',
            error
          );

          this.carregando = false;

          this.toastr.error(
            'Não foi possível carregar seu pedido.'
          );
        }

      });
  }

  get etapaAtual(): number {

    switch (this.pedido?.status) {

      case 'Pendente':
        return 1;

      case 'Pago':
      case 'EtiquetaGerada':
        return 3;

      case 'Enviado':
        return 4;

      case 'Entregue':
        return 5;

      default:
        return 1;
    }
  }

  etapaConcluida(etapa: number): boolean {
    return this.etapaAtual >= etapa;
  }

  etapaAtiva(etapa: number): boolean {
    return this.etapaAtual === etapa;
  }
}
