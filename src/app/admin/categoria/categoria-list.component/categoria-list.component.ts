import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoriaModel, CategoriaPesquisaModel } from '../../../models/categoria.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css',
})
export class CategoriaListComponent implements OnInit {

  constructor(private router: Router, private categoriaService: CategoriaService) { }
  async ngOnInit(): Promise<void> {

    await this.load();
  }

  async load()
  {
    this.categoriaService.listaCategoriaProduto().subscribe((categorias: CategoriaPesquisaModel[]) => {
      this.categorias = categorias;
    });
  }
  novo() {
    this.router.navigate(['/admin/categoria/novo']);
  }
  pesquisa = new FormControl('');

  categorias: CategoriaPesquisaModel[] = [];

  editar(id: string) {
    this.router.navigate(['/admin/categoria/editar',id]);
  }
  excluir(categoria: CategoriaPesquisaModel) {

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


          this.categoriaService.delete(categoria.id).subscribe({
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
                text: 'Não foi possível excluir a categoria.'
              });

              console.error(erro);
            }
          });
        }
      });

  }
  get categoriasFiltradas(): CategoriaPesquisaModel[] {

    const texto =
      this.pesquisa.value?.toLowerCase().trim() ?? '';

    if (!texto)
      return this.categorias;

    return this.categorias.filter(x =>
      x.categoria_Nome.toLowerCase().includes(texto)
    );
  }
}
