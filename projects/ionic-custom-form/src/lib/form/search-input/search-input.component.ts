import {
  Component,
  Injector,
  Input,
  EventEmitter,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'gs3-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
})
export class SearchInputComponent implements ControlValueAccessor {
  required = false;
  @Input()
  placeholder? = '';
  @Input()
  label = '';

  @Input()
  formControlName? = '';

  input = '';
  @Input()
  disabled!: boolean;
  @Input()
  maxlength!: number;
  @Input()
  type = 'text';
  public ngControl: NgControl | null = null;

  @Output()
  valueEmitter: EventEmitter<string> = new EventEmitter<string>();

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

  writeValue(input: string) {
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
