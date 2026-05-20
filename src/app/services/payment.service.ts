import { Injectable }
  from '@angular/core';

import { HttpClient }
  from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  api =
    'https://localhost:7071/api/Pagamento';

  constructor(
    private http: HttpClient
  ) { }

  gerarPix(data: any) {

    return this.http.post(

      `${this.api}/pix`,

      data
    );
  }
  status(paymentId: number) {

    return this.http.get(

      `${this.api}/status/${paymentId}`
    );
  }
}
