import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categoria',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
   
  ], 
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent implements OnInit {
  [x: string]: any;
  form!: FormGroup;
  editMode = false;
  loading = false;
  categoriaId: string | null = null;
 
  constructor(
    private fb: FormBuilder,
    private serv: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,) { }

  ngOnInit(): void {

    this.categoriaId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      id: [''],
      categoria_Nome: ['', Validators.required]
    });

    if (this.categoriaId) {
      this.editMode = true;
      this.getCategoria(this.categoriaId);
    } else this.limpar();

  }
  limpar() {

    this.form.reset();
  }
  getCategoria(id: string) {

    this.loading = true;

    this.serv.getById(id).subscribe({
      next: (categoria) => {
        this.form.patchValue(categoria);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append(
      'Categoria_Nome',
      this.form.value.categoria_Nome
    );

    formData.append(
      'Id',
      this.form.value.id
    );



    this.loading = true;


    if (this.categoriaId)
    {
      this.serv.update(this.categoriaId ??'', formData).subscribe({
        next: () => {

          this.toastr.success(
            'Categoria mandala cadastrada com sucesso!'
          );

          this.router.navigate(['/admin/listacategoria']);
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            'Erro ao salvar mandala.'
          );
        }
      });

      return;
    }
 
    this.serv.create(formData).subscribe({
      next: () => {
        this.toastr.success(
          'Categoria Mandala cadastrada com sucesso!'
        );

        this.router.navigate(['/admin/produtos']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  
}
