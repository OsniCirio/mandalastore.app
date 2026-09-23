import { ChangeDetectorRef, Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../../services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pix-payment',
  imports: [CommonModule],
  templateUrl: './pix-payment.component.html',
  styleUrl: './pix-payment.component.css',
})
export class PixPaymentComponent {
  pix: any;

  loading = false;
  pedidoId: string | null = null;
  paymentId!: number;

  constructor(
    private paymentService:
      PaymentService,
    private toastr: ToastrService,
    private pedido: PedidoService,
    private route: ActivatedRoute,
    private router: Router,
   private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this.pedidoId = this.route.snapshot.paramMap.get('id');
    this.gerarPix();
  }

  gerarPix() {

    this.loading = true;

    this.paymentService
      .gerarPix(this.pedidoId)
      .subscribe({

        next: (response: any) => {
          debugger;
          this.paymentId = response.paymentId;
          this.pix = response;

          this.loading = false;
          this.cd.detectChanges();

          this.startPolling();
        },

        error: () => {
          this.loading = false;
        }
      });
  }
  startPolling() {

    setInterval(() => {

      this.paymentService
        .status(this.pedidoId!,this.paymentId)

        .subscribe({

          next: (response: any) => {

            if (
              response.status ===
              'approved'
            ) {


              this.toastr.success(
                'Pagamento aprovado. Pedido enviado para expedição.'
              );

              this.router.navigate(['/acompanhar-pedido', this.pedidoId]);

             
            }
          }
        });

    }, 5000);
  }
}
