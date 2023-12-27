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

@Component({
  selector: 'gs3-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
})
export class ToggleComponent implements ControlValueAccessor {
  @Input()
  label = 'Toggle';

  @Input()
  disabled = false;

  @Input()
  labelPlacement: 'start' | 'end' | 'fixed' | 'stacked' = 'start';

  required: boolean = false;

  @Output()
  changeValue: EventEmitter<boolean> = new EventEmitter();

  private ngControl: NgControl | null = null;

  selectedValue: boolean = false;
  constructor(private injector: Injector) {}

  private get control(): NgControl | null {
    if (!this.ngControl) {
      this.ngControl = this.injector.get(NgControl, null);
    }
    this.required =
      this.ngControl?.control?.hasValidator(Validators.required) || false;

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

  writeValue(value?: boolean): void {
    this.selectedValue = value || false;
  }

  // Emit changes when the select value changes
  onValueChange(event: any) {
    this.selectedValue = event.detail.value;
    this.onChange(event.detail.value);
    this.changeValue.emit(event.detail.checked);
    this.onTouch();
  }

  // Check if the FormControl is invalid
  get isInvalid() {
    const control = this.control?.control;
    return control && control.invalid && (control?.touched || control?.dirty);
  }
}
