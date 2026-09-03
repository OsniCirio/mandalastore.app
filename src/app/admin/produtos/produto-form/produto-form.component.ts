import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../../services/produto.service';
import { environment } from '../../../app.config';
import { ToastrService }  from 'ngx-toastr';
import { MaskDirective } from '../../../shared/directives/mask';
import { DecimalMaskDirective } from '../../../shared/directives/app-decimal-mask';
import {
  NgxMaskDirective,
  NgxMaskPipe,
  provideEnvironmentNgxMask,
  provideNgxMask
} from 'ngx-mask';
import { CategoriaService } from '../../../services/categoria.service';
import { CategoriaModel } from '../../../models/categoria.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.css'
})
export class ProductFormComponent implements OnInit, OnDestroy {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  form!: FormGroup;
  productId: string | null = null;
  editMode = false;
  loading = false;
  

  selectedFile: File | null = null;
  previewImage: string | null = null;

  categorias = signal<CategoriaModel[]>([]);
  carregandoCategorias = signal<boolean>(false);

  cameraActive = false;
  private stream: MediaStream | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.carregarCategorias();

    this.productId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.productId;

    if (this.editMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }
  carregarCategorias(): void {

    this.carregandoCategorias.set(true);

    this.categoriaService.listar()
      .subscribe({
        next: categorias => {
          this.categorias.set(categorias);
          this.carregandoCategorias.set(false);
        },

        error: erro => {
          console.error(erro);
          this.carregandoCategorias.set(false);
        }
      });
  }
  ngOnDestroy(): void {
    this.stopCamera();
  }

  createForm(): void {
    this.form = this.fb.group({

      nome: ['', Validators.required],

      descricao: ['', Validators.required],

      categoriaId: ['', Validators.required],

      preco: [0, Validators.required],

      altura: [0, Validators.required],

      largura: [0, Validators.required],

      estoque: [0, Validators.required],

      peso: [0, Validators.required],

      ativo: [true]
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        this.previewImage = `${environment.uploadsUrl}${product.imagemUrl ?? null}`;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  onDragOver(event: DragEvent): void {

    event.preventDefault();
  }

  onDrop(event: DragEvent): void {

    event.preventDefault();

    if (
      !event.dataTransfer ||
      event.dataTransfer.files.length === 0
    ) {
      return;
    }

    const file =
      event.dataTransfer.files[0];

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.previewImage =
        reader.result as string;
    };

    reader.readAsDataURL(file);
  }


  removeImage(): void {

    this.previewImage = null;

    this.selectedFile = null;
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.selectedFile = file;

    const reader = new FileReader();
    
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        },
        audio: false
      });

      this.cameraActive = true;

      setTimeout(() => {
        if (this.video?.nativeElement && this.stream) {
          this.video.nativeElement.srcObject = this.stream;
        }
      }, 100);

    } catch {

      this.toastr.warning(
        'Não foi possível acessar a câmera.'
      );

    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.cameraActive = false;
  }
  getImageUrl(
    image?: string
  ): string {

    if (!image) {

      return'assets/images/no-image.jpg';
    }

    return `${environment.uploadsUrl}${image}`;
  }
  capturePhoto(): void {
    const videoElement = this.video.nativeElement;
    const canvasElement = this.canvas.nativeElement;

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    const context = canvasElement.getContext('2d');

    if (!context) {
      return;
    }

    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    canvasElement.toBlob((blob) => {
      if (!blob) {
        return;
      }

      const file = new File(
        [blob],
        'mandala-camera.jpg',
        { type: 'image/jpeg' }
      );

      this.selectedFile = file;
      this.previewImage = URL.createObjectURL(file);

      this.stopCamera();

    }, 'image/jpeg', 0.95);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append(
      'nome',
      this.form.value.nome
    );

    formData.append(
      'descricao',
      this.form.value.descricao
    );

    formData.append(
      'categoria',
      this.form.value.categoria
    );
    formData.append(
      'categoriaId',
      this.form.value.categoriaId
    );

    formData.append(
      'preco',
      this.form.value.preco
    );

    formData.append(
      'estoque',
      this.form.value.estoque
    );

    formData.append(
      'peso',
      this.form.value.peso
    );

    formData.append(
      'largura',
      this.form.value.largura
    );

    formData.append(
      'altura',
      this.form.value.altura
    );


 
    formData.append(
      'ativo',
      this.form.value.ativo
    );

    if (this.selectedFile) {

      formData.append(
        'imagem',
        this.selectedFile
      );
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.loading = true;

    if (this.editMode && this.productId) {

      this.productService.update(this.productId, formData).subscribe({
        next: () => {

          this.toastr.success(
            'Mandala cadastrada com sucesso!'
          );

          this.router.navigate(['/admin/produtos']);
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

    this.productService.create(formData).subscribe({
      next: () => {
        this.toastr.success(
          'Mandala cadastrada com sucesso!'
        );

        this.router.navigate(['/admin/produtos']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}


