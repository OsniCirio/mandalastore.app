
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface Material {
  titulo: string;
  subtitulo: string;
  imagem: string;
  descricao: string;
}

@Component({
  selector: 'app-materiais',
  imports: [CommonModule],
  templateUrl: './materiais.component.html',
  styleUrl: './materiais.component.css',
})


export class MateriaisComponent {

  materialSelecionado?: Material;

  materiais: Material[] = [
    {
      titulo: 'Pedras Naturais',
      subtitulo: 'Natural',
      imagem: 'assets/materiais/pedras-naturais.png',
      descricao:
        'Os cristais naturais são tradicionalmente associados à meditação, ao equilíbrio e à harmonia. Além de sua simbologia, suas cores, formas e características únicas tornam cada composição especial.'
    },
    {
      titulo: 'Fio de Juta',
      subtitulo: 'Artesanal',
      imagem: 'assets/materiais/fio_juta.png',
      descricao:
        'A juta é uma fibra natural amplamente utilizada no artesanato. Seu aspecto rústico e sua textura característica acrescentam personalidade e uma conexão natural à composição das mandalas.'
    },
    {
      titulo: 'Fio de Cetim',
      subtitulo: 'Delicadeza',
      imagem: 'assets/materiais/fio_cetim.png',
      descricao:
        'O fio de cetim possui acabamento suave e brilho característico. Nas mandalas, contribui com delicadeza, contraste e um acabamento visual refinado.'
    },
    {
      titulo: 'Base em MDF',
      subtitulo: 'Estrutura',
      imagem: 'assets/materiais/mdf.png',
      descricao:
        'O MDF é um painel de madeira reconstituída produzido pela aglutinação de fibras de madeira com resinas. Utilizado como base, proporciona firmeza e estabilidade à composição.'
    }
  ];

  abrirMaterial(material: Material): void {
    this.materialSelecionado = material;
  }

  fecharMaterial(): void {
    this.materialSelecionado = undefined;
  }
}
