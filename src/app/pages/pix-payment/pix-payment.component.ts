import { ChangeDetectorRef, Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pix-payment',
  imports: [CommonModule],
  templateUrl: './pix-payment.component.html',
  styleUrl: './pix-payment.component.css',
})
export class PixPaymentComponent {
  pix: any;

  loading = false;

  paymentId!: number;

  constructor(
    private paymentService:
      PaymentService,
    private toastr: ToastrService,
   private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this.gerarPix();
  }

  gerarPix() {

   
    this.loading = true;

    this.paymentService
      .gerarPix({

        valor: 1,

        email: 'teste@teste.com',

        nome: 'Osni'
      })

      .subscribe({

        next: (response : any) => {


          this.paymentId =
            response.paymentId;

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
        .status(this.paymentId)

        .subscribe({

          next: (response: any) => {

            if (
              response.status ===
              'approved'
            ) {

              this.toastr.success(
                'Pagamento aprovado!'
              );
            }
          }
        });

    }, 5000);
  }
}
