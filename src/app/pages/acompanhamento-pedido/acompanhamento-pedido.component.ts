import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PedidoService } from '../../services/pedido.service';
import { AcompanhamentoPedido } from '../../models/acompanhamento-pedido.model';

@Component({
  selector: 'app-acompanhamento-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acompanhamento-pedido.component.html',
  styleUrl: './acompanhamento-pedido.component.css'
})
export class AcompanhamentoPedidoComponent implements OnInit {

  pedido?: AcompanhamentoPedido;
  token!: string;
  carregando = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.toastr.error('Link de acompanhamento inválido.');
      return;
    }

    this.token = token;
    this.carregarPedido();
  }

  carregarPedido(): void {

    this.carregando = true;

    this.pedidoService.getAcompanhamento(this.token)
      .subscribe({

        next: (pedido: AcompanhamentoPedido) => {
          this.pedido = pedido;
          this.carregando = false;
          this.cd.detectChanges();
        },

        error: (error) => {
          console.error('Erro ao carregar pedido:', error);

          this.carregando = false;
          this.cd.detectChanges();

          this.toastr.error(
            error.status === 404
              ? 'Link de acompanhamento inválido ou expirado.'
              : 'Não foi possível carregar seu pedido.'
          );
        }

      });
  }

  get etapaAtual(): number {
    switch (this.pedido?.status) {
      case 'Pendente':
        return 1;

      case 'Pago':
        return 2;

      case 'PreparandoEnvio':
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
