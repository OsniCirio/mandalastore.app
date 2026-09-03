import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[appDecimalMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DecimalMaskDirective),
      multi: true
    }
  ]
})
export class DecimalMaskDirective implements ControlValueAccessor {

  @Input() decimalPlaces = 2;

  private onChange:
    (value: string | null) => void = () => { };
  private onTouched: () => void = () => { };

  private typing = false;

  constructor(
    private elementRef: ElementRef<HTMLInputElement>
  ) { }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {

    this.typing = true;

    const input = event.target as HTMLInputElement;

    let value = input.value;

    // Aceita números, vírgula e ponto
    value = value.replace(/[^\d,.]/g, '');

    // Ponto digitado vira vírgula
    value = value.replace('.', ',');

    // Apenas uma vírgula
    const commaIndex = value.indexOf(',');

    if (commaIndex >= 0) {

      const integerPart =
        value.substring(0, commaIndex);

      let decimalPart =
        value.substring(commaIndex + 1)
          .replace(/,/g, '');

      decimalPart =
        decimalPart.substring(0, this.decimalPlaces);

      value =
        (integerPart || '0') +
        ',' +
        decimalPart;
    }

    // Atualiza somente o visual
    input.value = value;

    if (
      value === '' ||
      value === ','
    ) {
      this.onChange(null);
      this.typing = false;
      return;
    }

    const normalized =
      value.replace(',', '.');

    const normalizedValue =
      value.replace(',', '.');

    this.onChange(normalizedValue);

 

    //if (!Number.isNaN(numericValue)) {
    //  this.onChange(numericValue);
    //}

    this.typing = false;
  }

  @HostListener('blur')
  onBlur(): void {

    this.onTouched();

    const input =
      this.elementRef.nativeElement;

    if (!input.value) {
      return;
    }


    let _input = input.value.replace('.', '');
    _input = _input.replace(',', '.');

   

    if (!Number.isNaN(_input)) {
      input.value = _input;
        

    }
    alert(input.value);

  }

  writeValue(
    value: number | null
  ): void {

    // Não deixa o Angular destruir
    // o texto enquanto estamos digitando
    if (this.typing) {
      return;
    }

    const input =
      this.elementRef.nativeElement;

    if (
      value === null ||
      value === undefined
    ) {
      input.value = '';
      return;
    }

    input.value =
      this.formatValue(Number(value));
  }

  registerOnChange(
    fn: (value: string | null) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(
    fn: () => void
  ): void {
    this.onTouched = fn;
  }

  setDisabledState(
    isDisabled: boolean
  ): void {
    this.elementRef.nativeElement.disabled =
      isDisabled;
  }

  private formatValue(
    value: number
  ): string {

    return value.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits:
          this.decimalPlaces,

        maximumFractionDigits:
          this.decimalPlaces
      }
    );
  }
}
