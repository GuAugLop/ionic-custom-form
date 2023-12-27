import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'gs3-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  required = false;
  @Input()
  label = '';

  @Input()
  formControlName? = '';

  input = false;
  @Input()
  disabled!: boolean;
  @Input()
  maxlength!: number;
  @Input()
  type = 'text';
  public ngControl: NgControl | null = null;

  @Output()
  valueEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private injector: Injector) {}
  // Step 3: Copy paste this stuff here
  onChange: any = () => {};
  onTouch: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(input: boolean) {
    this.input = input;
  }

  handleChange() {
    this.valueEmitter.emit(this.input);
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
}
