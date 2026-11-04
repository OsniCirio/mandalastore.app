
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TemaModel, TemaPesquisaModel } from '../../models/tema.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TemaService } from '../../services/tema.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-temas-list',
  imports: [ReactiveFormsModule],
  templateUrl: './temas-list.component.html',
  styleUrl: './temas-list.component.css',
})



export class TemasListComponent implements OnInit {

  constructor(private router: Router, private temaService: TemaService) { }
  async ngOnInit(): Promise<void> {

    await this.load();
  }

  async load() {
    this.temaService.listaTemaProduto().subscribe((tema: TemaPesquisaModel[]) => {
      this.temas = tema;
    });
  }
  novo() {
    this.router.navigate(['/admin/tema/novo']);
  }
  pesquisa = new FormControl('');

  temas: TemaPesquisaModel[] = [];

  editar(id: string) {
    this.router.navigate(['/admin/tema/editar', id]);
  }
  excluir(tema: TemaPesquisaModel) {

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


          this.temaService.delete(tema.id).subscribe({
            next: () => {

              this.load();

              Swal.fire({
                icon: 'success',
                title: 'Excluído com sucesso'
              });

            },

            error: (erro) => {

              Swal.fire({
                icon: 'error',
                title: 'Erro ao excluir',
                text: 'Não foi possível excluir a tema.'
              });

              console.error(erro);
            }
          });
        }
      });

  }
  get temasFiltradas(): TemaPesquisaModel[] {

    const texto =
      this.pesquisa.value?.toLowerCase().trim() ?? '';

    if (!texto)
      return this.temas;

    return this.temas.filter(x =>
      x.tema_Nome.toLowerCase().includes(texto)
    );
  }
}
