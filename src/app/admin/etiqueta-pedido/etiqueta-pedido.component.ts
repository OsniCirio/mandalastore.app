import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-etiqueta-pedido',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './etiqueta-pedido.component.html',
  styleUrl: './etiqueta-pedido.component.css'
})
export class EtiquetaPedidoComponent implements OnInit {

  pedido: any = null;
  carregando = false;
  pedidoId: string | null = '';   
 

  constructor(
    private pedidoService: PedidoService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {

    this.pedidoId = this.route.snapshot.paramMap.get('id');
  }

  buscarPedido(): void {

    if (!this.pedidoId?.trim()) {
      this.toastr.warning(
        'Informe o código do pedido.'
      );
      return;
    }

    this.carregando = true;
    this.pedido = null;

    this.pedidoService
      .getById(this.pedidoId.trim())
      .subscribe({

        next: (pedido: any) => {
          this.pedido = pedido;
          this.carregando = false;
        },

        error: () => {
          this.carregando = false;

          this.toastr.error(
            'Pedido não encontrado.'
          );
        }
      });
  }
}
