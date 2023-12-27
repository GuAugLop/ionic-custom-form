import {
  Component,
  Input,
  forwardRef,
  Injector,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'gs3-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent
  implements ControlValueAccessor, AfterContentChecked
{
  required: boolean = false;

  @Input()
  placeholder? = '';
  @Input()
  label = '';

  @Output()
  blur: EventEmitter<Event> = new EventEmitter();
  @Output()
  focus: EventEmitter<Event> = new EventEmitter();

  @Input()
  defaultValue? = '';

  @Input()
  labelPlacement = 'floating';

  @Input()
  formControlName? = '';
  @Input()
  type?: string;
  @Input()
  eye = false;
  @Input()
  mask?: 'currency' | 'password' | 'percentage' | string;
  @Input()
  maxlength!: number;
  @Input()
  disabled!: boolean;
  @Input()
  maxPercentage = 999;

  @Input()
  isNumeric = false;

  public ngControl: NgControl | null = null;

  constructor(private maskPipe: NgxMaskPipe, private injector: Injector) {}

  // Step 3: Copy paste this stuff here
  onChange: any = () => {};
  onTouch: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  input = '';

  writeValue(input: string) {
    if (this.mask) {
      if (this.mask === 'currency') {
        this.type = 'tel';
        if (!input) {
          input = '0,00';
        }
        this.input = this.formatCurrency(input);
      } else if (this.mask === 'password') {
        this.type = 'password';
        this.eye = true;
      } else if (this.mask === 'percentage') {
        this.type = 'tel';
        this.maxlength = 6;
        this.input = this.formatPercentage(input);
      } else {
        this.maxlength = this.mask.length;
        this.input = this.maskPipe.transform(input, this.mask);
      }
    } else {
      this.input = input;
    }
  }

  handleChange(event: any) {
    if (this.mask) {
      if (this.mask === 'password') return;
      if (this.mask === 'currency') {
        let val = this.input.replace(/\D/g, ''); // Remove non-digit characters
        if (!val) val = '0.00';
        this.input = this.formatCurrency(val);
      } else if (this.mask === 'percentage') {
        this.input = this.formatPercentage(this.input);
      } else {
        if (event.code !== 'Backspace' && event.code !== 'Delete') {
          this.input = this.maskPipe.transform(this.input, this.mask);
        }
      }
      this.onChange(this.input);
    }
  }

  onBlur(event: Event) {
    this.blur.emit(event);
    this.onTouch(); // Mark the control as touched
  }

  onFocus(event: Event) {
    this.focus.emit(event);
  }

  private get control(): NgControl | null {
    if (!this.ngControl) {
      this.ngControl = this.injector.get(NgControl, null);
    }

    return this.ngControl;
  }

  ngAfterContentChecked() {
    if (this.ngControl) {
      this.required =
        this.ngControl?.control?.hasValidator(Validators.required) || false;
    }
  }

  get isInvalid() {
    const control = this.control?.control;

    return control && control.invalid && (control.dirty || control.touched);
  }

  private formatCurrency(value: string): string {
    if (!value) return '';
    if (typeof value === 'string' && value.includes(',')) {
      value = String(+value.replace(/\./g, '').replace(',', '.') * 100);
    } else {
      value = String(+value);
    }
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      return '0,00';
    }

    return (numberValue / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatPercentage(value: string): any {
    if (!value) return '';
    if (this.input) {
      value = this.maskPipe.transform(
        value,
        value.length <= 2
          ? '00'
          : value.length <= 4
          ? '00.0'
          : value.length <= 5
          ? '00.00'
          : '000.00'
      );
    }
    if (this.maxPercentage && Number(value) > this.maxPercentage) {
      value = this.maxPercentage.toFixed(2);
    }
    return value;
  }
}
