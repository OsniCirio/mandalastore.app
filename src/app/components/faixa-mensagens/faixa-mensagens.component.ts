import { afterNextRender, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface MensagemBanner {
  readonly id: number;
  readonly texto: string;
  readonly fundo: string;
  readonly cor: string;
  readonly destaque: string;
}

@Component({
  selector: 'app-faixa-mensagens',
  imports: [],
  templateUrl: './faixa-mensagens.component.html',
  styleUrl: './faixa-mensagens.component.css',
})


export class  FaixaMensagensComponent {

  readonly mensagens: readonly MensagemBanner[] = [
    {
      id: 1,
      texto: 'Arte que acalma o olhar e acolhe a alma.',
      fundo: '#F6F2ED',
      cor: '#626762',
      destaque: '#CAB495'
    },
    {
      id: 2,
      texto: 'Cada detalhe nasce para levar harmonia ao seu espaço.',
      fundo: '#E8EDE5',
      cor: '#4F5B50',
      destaque: '#B9826F'
    },
    {
      id: 3,
      texto: 'Pedras, fios e intenção unidos em uma criação única.',
      fundo: '#EFE3DC',
      cor: '#66544F',
      destaque: '#7C8E75'
    },
    {
      id: 4,
      texto: 'Formas que inspiram, cores que equilibram e energia que transforma.',
      fundo: '#E7ECEC',
      cor: '#4D5A5C',
      destaque: '#B99473'
    },
    {
      id: 5,
      texto: 'Criadas à mão para transformar espaços em refúgios.',
      fundo: '#EEE7DA',
      cor: '#5E574E',
      destaque: '#879680'
    },
    {
      id: 6,
      texto: 'Mais que decoração: presença, significado e conexão.',
      fundo: '#F6F2ED',
      cor: '#596158',
      destaque: '#B9826F'
    },
    {
      id: 7,
      texto: 'Sua casa também merece boas vibrações.',
      fundo: '#E8EDE5',
      cor: '#505B51',
      destaque: '#CAB495'
    },
    {
      id: 8,
      texto: 'Encontre a mandala que traduz a sua essência.',
      fundo: '#EFE3DC',
      cor: '#62534E',
      destaque: '#7C8E75'
    }
  ];


  readonly indiceAtual = signal(0);

  readonly pausado = signal(false);

  readonly mensagemAtual = computed(
    () => this.mensagens[this.indiceAtual()]
  );

  private readonly navegadorPronto = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  private readonly tempoExibicao = 6500;
  constructor(private router: Router
  ) {
    // Só inicia o temporizador depois que a página estiver
    // renderizada no navegador.
    afterNextRender(() => {

      if (!this.destroyRef.destroyed) {
        this.navegadorPronto.set(true);
      }
    });

    effect((onCleanup) => {

      const navegadorPronto =
        this.navegadorPronto();

      const estaPausado =
        this.pausado();

      const indice =
        this.indiceAtual();

      if (
        !navegadorPronto ||
        estaPausado ||
        this.mensagens.length <= 1
      ) {
        return;
      }

      const temporizador =
        window.setTimeout(() => {

          const proximoIndice =
            (indice + 1) %
            this.mensagens.length;

          this.indiceAtual.set(
            proximoIndice
          );

        }, this.tempoExibicao);

      // Executado antes de criar o próximo temporizador
      // ou quando o componente for destruído.
      onCleanup(() => {
        window.clearTimeout(
          temporizador
        );
      });
    });
  }
  selecionarMensagem(indice: number): void {

    if (
      indice < 0 ||
      indice >= this.mensagens.length
    ) {
      return;
    }

    this.indiceAtual.set(indice);
  }

  alternarPausa(): void {

    this.pausado.update(
      valorAtual => !valorAtual
    );
  }
}

