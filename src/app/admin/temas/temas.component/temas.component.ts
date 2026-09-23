import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TemaService } from '../../../services/tema.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-temas',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './temas.component.html',
  styleUrl: './temas.component.css',
})
export class TemasComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  loading = false;
  temaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private serv: TemaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,) { }

  ngOnInit(): void {

    this.temaId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      id: [''],
      ordem:[1],
      tema_Nome: ['', Validators.required]
    });

    if (this.temaId) {
      this.editMode = true;
      this.getTema(this.temaId);
    } else this.limpar();

  }
  limpar() {

    this.form.reset();
  }
  getTema(id: string) {

    this.loading = true;

    this.serv.getById(id).subscribe({
      next: (tema) => {
        this.form.patchValue(tema);
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
      'Tema_Nome',
      this.form.value.tema_Nome
    );

    formData.append(
      'Ordem',
      this.form.value.ordem
    );

    formData.append(
      'Id',
      this.form.value.id
    );



    this.loading = true;


    if (this.temaId) {
      this.serv.update(this.temaId ?? '', formData).subscribe({
        next: () => {

          this.toastr.success(
            'Tema mandala cadastrada com sucesso!'
          );

          this.router.navigate(['/admin/listatema']);
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
          'Tema Mandala cadastrada com sucesso!'
        );

        this.router.navigate(['/admin/produtos']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}
