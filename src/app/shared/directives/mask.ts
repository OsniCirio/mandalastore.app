import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMask]',
  standalone: true
})
export class MaskDirective {

  @Input() appMask = '';

  // Quantidade de casas decimais
  @Input() decimalPlaces = 2;

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (this.appMask === 'decimal') {
      this.applyDecimal(input);
      return;
    }

    this.applyMask(input);
  }

  private applyMask(input: HTMLInputElement): void {

    const value = input.value.replace(/\D/g, '');

    let result = '';
    let valueIndex = 0;

    for (
      let maskIndex = 0;
      maskIndex < this.appMask.length &&
      valueIndex < value.length;
      maskIndex++
    ) {
      const maskChar = this.appMask[maskIndex];

      if (maskChar === '0') {
        result += value[valueIndex++];
      } else {
        result += maskChar;
      }
    }

    input.value = result;

    this.ngControl.control?.setValue(
      result,
      { emitEvent: false }
    );
  }


  private applyDecimal(input: HTMLInputElement): void {

    let value = input.value;

    // Aceita números e apenas vírgula
    value = value.replace(/[^\d,]/g, '');

    // Permite somente uma vírgula
    const firstComma = value.indexOf(',');

    if (firstComma !== -1) {
      value =
        value.substring(0, firstComma + 1) +
        value.substring(firstComma + 1).replace(/,/g, '');
    }

    // Se começar com vírgula, transforma em 0,
    if (value.startsWith(',')) {
      value = '0' + value;
    }

    // Limita as casas decimais
    if (value.includes(',')) {

      const parts = value.split(',');

      value =
        parts[0] +
        ',' +
        parts[1].substring(0, this.decimalPlaces);
    }

    // Mantém a máscara visível
    input.value = value;

    if (value === '') {

      this.ngControl.control?.setValue(
        null,
        {
          emitEvent: false,
          emitModelToViewChange: false
        }
      );

      return;
    }

    // Converte 0,750 -> 0.75
    const numericValue = Number(
      value.replace(',', '.')
    );

    if (!isNaN(numericValue)) {

      this.ngControl.control?.setValue(
        numericValue,
        {
          emitEvent: false,

          // IMPORTANTE:
          // não deixa o Angular sobrescrever
          // o valor mascarado do input
          emitModelToViewChange: false
        }
      );
    }
  }
}
