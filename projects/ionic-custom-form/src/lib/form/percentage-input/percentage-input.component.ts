import { Component, Input, forwardRef, Injector } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'gs3-percentage-input',
  templateUrl: './percentage-input.component.html',
  styleUrls: ['./percentage-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PercentageInputComponent),
      multi: true,
    },
  ],
})
export class PercentageInputComponent implements ControlValueAccessor {
  @Input()
  placeholder? = '';
  @Input()
  label = '';
  @Input()
  labelPlacement = 'floating';
  @Input()
  disabled!: boolean;
  @Input()
  max = 100;

  required = false;

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
    this.input = input;
  }

  onBlur() {
    this.onTouch(); // Mark the control as touched
  }

  private get control(): NgControl | null {
    if (!this.ngControl) {
      this.ngControl = this.injector.get(NgControl, null);
    }
    this.required = this.ngControl?.control?.hasValidator(
      Validators.required
    ) as boolean;

    return this.ngControl;
  }

  get isInvalid() {
    const control = this.control?.control;
    return control && control.invalid && (control.dirty || control.touched);
  }

  format() {
    if (this.input) {
      this.input = this.maskPipe.transform(
        this.input,
        this.input.length <= 2
          ? '00'
          : this.input.length <= 4
          ? '00.0'
          : this.input.length <= 5
          ? '00.00'
          : '000.00'
      );
    }
    if (this.max && Number(this.input) > this.max) {
      this.input = this.max.toFixed(2);
    }
    this.onChange(this.input);
  }
}
