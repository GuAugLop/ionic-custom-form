import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';

export type RadioOptions = {
  value: any;
  label: string;
};

@Component({
  selector: 'gs3-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  @Input()
  label = 'Select';

  @Input()
  values: RadioOptions[] = [];

  @Input()
  disabled = false;

  required = false;

  @Output()
  changeValue: EventEmitter<RadioOptions> = new EventEmitter();

  private ngControl: NgControl | null = null;
  selectedValue: any;
  constructor(private injector: Injector) {}

  private get control(): NgControl | null {
    if (!this.ngControl) {
      this.ngControl = this.injector.get(NgControl, null);
    }
    this.required = this.ngControl?.control?.hasValidator(
      Validators.required
    ) as boolean;

    return this.ngControl;
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  // Emit changes when the select value changes
  onValueChange(event: any) {
    this.selectedValue = event.detail.value;
    this.onChange(event.detail.value);
    this.changeValue.emit(
      this.values.find((i) => i.value === event.detail.value)
    );
    this.onTouch();
  }

  // Check if the FormControl is invalid
  get isInvalid() {
    const control = this.control?.control;
    return control && control.invalid && (control?.touched || control?.dirty);
  }
}
