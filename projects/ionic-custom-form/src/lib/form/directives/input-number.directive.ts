import { Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[inputNumber]'
})
export class InputNumberDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  isNumeric = false;
  _maxLength: number = 99;

  @Input('inputNumber') set inputNumber(isNumeric: boolean) {
    this.isNumeric = isNumeric;
    if (isNumeric) {
      this.renderer.addClass(this.elementRef.nativeElement, 'input-number');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'input-number');
    }
  }

  @Input() set maxLength(value: number) {
    this._maxLength = value;
  }

  @HostListener('keypress', ['$event'])
  onInput(event: any) {
    if (this.isNumeric) {
      const pattern = /[0-9]/;
      const inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);
      if (this.elementRef.nativeElement.value?.length >= this._maxLength) {
        event.preventDefault();
        return false;
      }
      if (!pattern.test(inputChar)) {
        event.preventDefault();
        return false;
      }
    }
    return true;
  }
}
