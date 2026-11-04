import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { ProdutoService } from '../../../services/produto.service';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule,
    RouterModule],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutosListComponent implements OnInit {

  apiUrl = environment.uploadsUrl;

  mandalas: any[] = [];

  loading = false;

  constructor(
    private router: Router,
    private mandalaService: ProdutoService,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.mandalaService.listar().subscribe({
      next: (res) => {
        this.mandalas = res;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
 
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar as mandalas.'
        });
      }
    });
   
  }

  editar(id: string) {

    this.router.navigate([
      'admin/produtos/editar/',
      id
    ]);
  }

  detalhes(item: any) {

    Swal.fire({
      title: item.nome,
      html: `
        <img
          src="${this.apiUrl + item.imagemUrl}"
          style="
            width:100%;
            border-radius:12px;
            margin-bottom:15px;
          ">

        <p>
          ${item.descricao}
        </p>

        <h4 style="color:#0d6efd;">
          R$  ${item.preco}
        </h4>
      `,
      width: 700,
      confirmButtonText: 'Fechar'
    });
  }

  excluir(id: string) {

    Swal.fire({
      title: 'Excluir mandala?',
      text: 'Essa ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar'
    })
      .then(result => {

        if (result.isConfirmed) {

          // chamada API depois
          this.mandalas =
            this.mandalas.filter(x => x.id !== id);

          Swal.fire({
            icon: 'success',
            title: 'Excluído com sucesso'
          });
        }
      });
  }
}
